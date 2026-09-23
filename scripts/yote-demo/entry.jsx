// Live Yöte fields for v7/work/yote.html. Bundled to v7/work/yote-demo.js
// with React inlined, so the page stays a plain static file.
// Rebuild with: node scripts/yote-demo/build.mjs

import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { PinInput, DateInput, CardInput, PhoneInput } from 'yote-ui'

// The code the pin field accepts. Anything else shows the error, and
// errorKey makes the shake replay when the same wrong code is tried twice.
const CODE = '4821'

function Pin() {
  const [value, setValue] = React.useState('')
  const [error, setError] = React.useState(null)
  const [attempt, setAttempt] = React.useState(0)
  return (
    <PinInput
      length={4}
      label="Verification code"
      hint={`Try a wrong code twice, then ${CODE}.`}
      value={value}
      onChange={(v) => {
        setValue(v)
        if (v.length < 4) setError(null)
      }}
      onComplete={(v) => {
        if (v === CODE) {
          setError(null)
        } else {
          setError('That code does not match. Try again.')
          setAttempt((n) => n + 1)
        }
      }}
      error={error}
      errorKey={attempt}
    />
  )
}

function Date_() {
  return <DateInput label="Date of birth" hint="Type the digits. The slashes are the field's job." />
}

function Card() {
  const [brand, setBrand] = React.useState('unknown')
  const names = { visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express', discover: 'Discover' }
  return (
    <CardInput
      label="Card number"
      onBrandChange={setBrand}
      hint={names[brand] ? `Recognised as ${names[brand]}.` : 'Start with 4 for Visa, or 37 for Amex and watch the groups change.'}
    />
  )
}

function Phone() {
  return <PhoneInput label="Phone number" defaultCountry="NG" hint="The country and the number stay two values." />
}

const FIELDS = { pin: Pin, date: Date_, card: Card, phone: Phone }

document.querySelectorAll('[data-yote-demo]').forEach((el) => {
  const Field = FIELDS[el.getAttribute('data-yote-demo')]
  if (Field) createRoot(el).render(<Field />)
})
