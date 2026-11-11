// Runs before the app boots: puts the demo in its starting state, then
// hands over to the script once the app is on screen.
import posthog from 'posthog-js';

import { generateTemporaryPassword, stashPendingSignup } from '@/lib/auth/pending-signup';

const params = new URLSearchParams(location.search);
const demo = params.get('demo') ?? 'app';

export async function prepare() {
    // Arriving from the verify link: the sign-up's temporary password is
    // stashed, which is what makes the profile step ask for a real one
    if (demo === 'onboarding') {
        const store = (window as unknown as { __cgStore: { email: string } }).__cgStore;
        await stashPendingSignup(store.email, generateTemporaryPassword(), true);
    }
    if (demo === 'support') fakeConversations();
    // Onboarding is the whole screen; its links (Get started, Skip, the
    // terms) would lead into the rest of the app, so in the demo they don't
    if (demo === 'onboarding') {
        addEventListener('click', e => {
            if ((e.target as Element).closest?.('a[href]')) {
                e.preventDefault();
                e.stopPropagation();
            }
        }, true);
    }
    void import('./driver').then(m => m.start(demo));
}

/* Support runs on PostHog Conversations. In the demo a small stand-in plays
   both ends: one earlier, closed ticket, and a reply to whatever is sent,
   picked up by the card's own poll the way a real one would be. */
function fakeConversations() {
    const iso = (offsetMs: number) => new Date(Date.now() + offsetMs).toISOString();
    const day = 86_400_000;
    type Msg = { id: string; content: string; author_type: string; author_name: string; created_at: string; is_private: boolean };
    const state: { ticketId: string | null; status: string; messages: Msg[]; tickets: Record<string, unknown>[] } = {
        ticketId: null,
        status: 'new',
        messages: [],
        tickets: [
            { id: 't_export', status: 'resolved', last_message: 'Thanks, the billing export is coming through now.', last_message_at: iso(-3 * day), created_at: iso(-4 * day), unread_count: 0 },
        ],
    };
    let n = 0;
    const fake = {
        isAvailable: () => true,
        getCurrentTicketId: () => state.ticketId,
        async getMessages(_ticket?: string, after?: string) {
            return { ticket_id: state.ticketId, ticket_status: state.status, has_more: false, unread_count: 0,
                messages: state.messages.filter(m => !after || m.created_at > after) };
        },
        async sendMessage(text: string) {
            state.ticketId ??= 't_alert';
            state.status = 'open';
            const sent: Msg = { id: `m${++n}`, content: text, author_type: 'customer', author_name: 'Ada Lovelace', created_at: iso(0), is_private: false };
            state.messages.push(sent);
            state.tickets = [{ id: state.ticketId, status: 'open', last_message: text, last_message_at: sent.created_at, created_at: sent.created_at, unread_count: 0 }, ...state.tickets.filter(t => t.id !== state.ticketId)];
            setTimeout(() => {
                const reply = 'Not expected. It fired again when the forecast crossed the threshold a second time on Tuesday. We’ve made it fire once per crossing, so it should be quiet from here.';
                state.messages.push({ id: `m${++n}`, content: reply, author_type: 'human', author_name: 'CostGraph Support', created_at: iso(0), is_private: false });
                state.tickets[0] = { ...state.tickets[0], last_message: reply, last_message_at: iso(0) };
            }, 1800);
            return { ticket_id: state.ticketId, message_id: sent.id, created_at: sent.created_at, ticket_status: 'open' };
        },
        async getTickets() {
            return { count: state.tickets.length, results: state.tickets };
        },
        async markAsRead() {
            return { success: true, unread_count: 0 };
        },
    };
    Object.defineProperty(posthog, 'conversations', { value: fake, configurable: true, writable: true });
}
