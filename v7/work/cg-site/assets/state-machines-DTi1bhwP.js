import{j as e,b4 as r}from"./index-DsR1DLZc.js";import{M as o}from"./MetaTags-CS1l9i9h.js";import{P as c}from"./PostLayout-D8P_rlRq.js";import{u as a}from"./_slug_-tUH8kxG7.js";import"./use-no-widows-D9jQVwQ8.js";import"./post-card-BbrxDHIA.js";const n=r("state-machines");function s(i){const t={code:"code",em:"em",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...a(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:n.title,description:n.summary,type:"article",url:n.canonicalUrl,author:n.authors[0],date:n.date,category:n.category,image:n.heroImage}),`
`,e.jsxs(c,{meta:n,children:[e.jsx(t.p,{children:"Distributed systems are a topic of keen interest to all of us at Baseline. At some point, we have all worked on one as a side project or in production. As much as we love to debate tradeoffs and the various ways we can apply distributed systems, we also recognize the vast majority of applications do not need complex solutions."}),e.jsx(t.p,{children:"In this blog, we will discuss our approach to applying state machines to an upcoming feature we have planned, how we arrived at using it, and a high-level implementation of what it looks like."}),e.jsx(t.h2,{children:"What is a state machine?"}),e.jsx(t.p,{children:"Before we begin to discuss how state machines fit into the problem we were faced with, it's important to understand what they are and the challenge they address."}),e.jsxs(t.p,{children:["State machines, or more formally ",e.jsx(t.strong,{children:"Finite State Machines (FSM)"}),", are a design pattern used to define a system that can transition between a set of defined states. Each state represents the status of that system at any given point in time. Transitioning between states is governed by a set of defined inputs; these inputs represent events that occur, and based on the event type, the system can transition between them."]}),e.jsxs(t.p,{children:["A common example of a state machine out in the wild is traffic lights. Fundamentally, there are three states a traffic light can transition between: ",e.jsx(t.strong,{children:"Stop"}),", ",e.jsx(t.strong,{children:"Ready"}),", and ",e.jsx(t.strong,{children:"Go"}),"."]}),e.jsxs("video",{controls:!0,className:"w-full rounded-xl shadow-sm",poster:"/placeholder-thumbnail.jpg",children:[e.jsx("source",{src:"https://media.jubril.xyz/fsm.mp4",type:"video/mp4"}),e.jsx(t.p,{children:"Your browser does not support the video tag."})]}),e.jsx(t.p,{children:"While traffic lights are more complex than just a timer transitioning between states, timers are one of the events that can trigger a state transition."}),e.jsx(t.h2,{children:"The problem"}),e.jsxs(t.p,{children:["One of our core features is per-process monitoring and recommendations for virtual machines via the CostGraph agent. While this is sufficient for a majority of the use cases our customers encounter, there is one question we often get asked: ",e.jsx(t.em,{children:'"What if I want to move my processes to a new virtual machine?"'})]}),e.jsx(t.p,{children:"To solve this problem, we introduced live migrations for VMs where you can move processes across virtual machines with zero downtime (you read that right). In order to achieve this, we needed to model migrations using a state machine for a few reasons:"}),e.jsxs(t.ol,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"Error classification"})," - Migrations can fail in different ways, which we grouped into transient and permanent errors. Permanent errors cannot be retried and require manual intervention, while transient errors can be retried at a later time."]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"State tracking"})," - At any given point in time, we need to know what state the VM is in before we can begin or continue a migration."]}),`
`]}),e.jsx(t.h2,{children:"Implementation"}),e.jsx(t.p,{children:"Writing a state machine in Golang can be fairly easy so long as you have well-defined states as well as rules for transitioning between them. Heading back to our traffic light example, if you needed to model the states, it would look something like this:"}),e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-go",children:`package main

import (
	"fmt"
)

type State string

const (
	Red    State = "RED"
	Yellow State = "YELLOW"
	Green  State = "GREEN"
)

type TrafficLight struct {
	currentState State
}

func NewTrafficLight() *TrafficLight {
	return &TrafficLight{
		currentState: Red,
	}
}
`})}),e.jsxs(t.p,{children:["Our state machine starts off with a couple of enums to represent each of the traffic light states. By default, a new instance of the ",e.jsx(t.code,{children:"TrafficLight"})," starts out Red. This is a good starting point, but how would transitions work?"]}),e.jsx(t.p,{children:"State transitions are governed or triggered by events. Representing this in code looks something like:"}),e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-go",children:`
type Event string

const (
	TimerExpired Event = "TIMER_EXPIRED"
	Emergency    Event = "EMERGENCY"
)

func (t *TrafficLight) Transition(event Event) error {
	switch t.currentState {
	case Red:
		if event == TimerExpired {
			t.currentState = Green
			return nil
		}
	case Green:
		if event == TimerExpired {
			t.currentState = Yellow
			return nil
		}
	case Yellow:
		if event == TimerExpired {
			t.currentState = Red
			return nil
		}
	}

	if event == Emergency {
		t.currentState = Red
		return nil
	}

	return fmt.Errorf("invalid transition: event %s not allowed in state %s", event, t.currentState)
}
`})}),e.jsxs(t.p,{children:[`Again, for simplicity's sake, we can assume that traffic lights are solely dependent on timers and some "emergency" event as defined in the `,e.jsx(t.code,{children:"Event"})," enum. With event types defined, you can then determine how your state machine reacts when an event is received."]}),e.jsxs(t.p,{children:["In our migration use case, we defined states such as ",e.jsx(t.code,{children:"Pending"}),", ",e.jsx(t.code,{children:"InProgress"}),", ",e.jsx(t.code,{children:"Completed"}),", and ",e.jsx(t.code,{children:"Failed"}),". Each of these states has specific events that can trigger transitions, such as ",e.jsx(t.code,{children:"StartMigration"}),", ",e.jsx(t.code,{children:"MigrationSuccess"}),", and ",e.jsx(t.code,{children:"MigrationFailure"}),". By defining these states and events, we were able to create a robust state machine that accurately models the migration process."]}),e.jsx(t.h2,{children:"Closing thoughts"}),e.jsx(t.p,{children:"State machines are a practical way to model systems that have a set of well-defined conditions. In this post, we highlighted how this ended up being how we approached the challenge of live migrations for the CostGraph agent."}),e.jsx(t.p,{children:"If this sounds interesting to you and you would like to try it out, drop us an email at  contact @ baselinehq dot cloud."})]})]})}function g(i={}){const{wrapper:t}={...a(),...i.components};return t?e.jsx(t,{...i,children:e.jsx(s,{...i})}):s(i)}export{g as default,n as meta};
