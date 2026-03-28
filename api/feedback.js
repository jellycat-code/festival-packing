import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, type, message } = req.body

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Message is required' })
  }

  const label = type || 'General'
  const from = name?.trim()

  try {
    await resend.emails.send({
      from: 'DustReady Feedback <onboarding@resend.dev>',
      to: 'jellycat.code@gmail.com',
      subject: `[DustReady] ${label} from ${from}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #2a2a2a;">
          <h2 style="color: #01665e; margin-bottom: 0.25rem;">DustReady Feedback</h2>
          <p style="color: #8a847e; font-size: 0.9rem; margin-top: 0;">${label}</p>
          <hr style="border: none; border-top: 1px solid #e0dbd4; margin: 1rem 0;">
          <p><strong>From:</strong> ${from}</p>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        </div>
      `,
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Resend error:', err)
    return res.status(500).json({ error: 'Failed to send message' })
  }
}
