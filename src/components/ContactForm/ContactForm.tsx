import { useRef, useState } from 'react'
import { profile } from '../../data/content'
import Icon from '../Icon/Icon'
import './ContactForm.css'

type Fields = { name: string; email: string; subject: string; message: string }
type Errors = Partial<Record<keyof Fields, string>>
type Status = 'idle' | 'sending' | 'success' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const env = import.meta.env as Record<string, string | undefined>
const SERVICE_ID = env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = env.VITE_EMAILJS_PUBLIC_KEY
const configured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY)

function validate(v: Fields): Errors {
  const e: Errors = {}
  if (!v.name.trim()) e.name = 'Please enter your name.'
  if (!v.email.trim()) e.email = 'Please enter your email address.'
  else if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email address.'
  if (!v.subject.trim()) e.subject = 'Please add a subject.'
  if (!v.message.trim()) e.message = 'Please write a message.'
  else if (v.message.trim().length < 10) e.message = 'Your message is a little short (10+ characters).'
  return e
}

export default function ContactForm() {
  const [values, setValues] = useState<Fields>({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [feedback, setFeedback] = useState('')
  const sending = useRef(false)

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (sending.current) return

    const form = new FormData(e.currentTarget)
    if (form.get('website')) return // honeypot: bots fill hidden fields

    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0]
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    if (!configured) {
      setStatus('error')
      setFeedback(
        `The contact form isn't connected to an email service yet, so this message was not sent. Please email ${profile.email} directly.`,
      )
      return
    }

    sending.current = true
    setStatus('sending')
    setFeedback('')
    try {
      const emailjs = (await import('@emailjs/browser')).default
      await emailjs.send(
        SERVICE_ID!,
        TEMPLATE_ID!,
        {
          from_name: values.name.trim(),
          reply_to: values.email.trim(),
          subject: values.subject.trim(),
          message: values.message.trim(),
        },
        { publicKey: PUBLIC_KEY! },
      )
      setStatus('success')
      setFeedback('Thank you — your message has been sent. I will get back to you soon.')
      setValues({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
      setFeedback(`Sorry, the message could not be sent. Please try again, or email ${profile.email} directly.`)
    } finally {
      sending.current = false
    }
  }

  const field = (
    key: keyof Fields,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <div className={`field${errors[key] ? ' has-error' : ''}`}>
      <label htmlFor={`cf-${key}`}>{label}</label>
      <input
        id={`cf-${key}`}
        name={key}
        value={values[key]}
        onChange={set(key)}
        aria-invalid={Boolean(errors[key])}
        aria-describedby={errors[key] ? `cf-${key}-err` : undefined}
        disabled={status === 'sending'}
        {...props}
      />
      {errors[key] && (
        <span id={`cf-${key}-err`} className="field__error" role="alert">
          {errors[key]}
        </span>
      )}
    </div>
  )

  return (
    <form className="cform" onSubmit={onSubmit} noValidate aria-label="Send a message">
      <div className="cform__head">
        <span className="kicker">Send a Message</span>
        <span className="mono">All fields required</span>
      </div>

      <div className="cform__row">
        {field('name', 'Name', { autoComplete: 'name', type: 'text' })}
        {field('email', 'Email', { autoComplete: 'email', type: 'email', inputMode: 'email' })}
      </div>
      {field('subject', 'Subject', { type: 'text' })}

      <div className={`field${errors.message ? ' has-error' : ''}`}>
        <label htmlFor="cf-message">Message</label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={set('message')}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'cf-message-err' : undefined}
          disabled={status === 'sending'}
        />
        {errors.message && (
          <span id="cf-message-err" className="field__error" role="alert">
            {errors.message}
          </span>
        )}
      </div>

      {/* Honeypot: hidden from people, visible to naive bots */}
      <div className="cform__trap" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="cform__actions">
        <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send Message'}
          <Icon name={status === 'sending' ? 'hourglass_top' : 'send'} />
        </button>
        <p
          className={`cform__status${status === 'success' ? ' is-ok' : ''}${status === 'error' ? ' is-err' : ''}`}
          role={status === 'error' ? 'alert' : 'status'}
          aria-live="polite"
        >
          {feedback}
        </p>
      </div>
    </form>
  )
}
