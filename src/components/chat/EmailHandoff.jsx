import React, { useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

// Same EmailJS account the contact form uses.
const EMAILJS_SERVICE_ID = 'service_2wtte0j';
const EMAILJS_TEMPLATE_ID = 'template_5arjl6k';
const EMAILJS_PUBLIC_KEY = 'tBuSbZ57Q0Hn6k-dJ';
const SENT_KEY = 'melbot_sent_emails';

// Chats are restored from localStorage, so the same SEND_EMAIL token renders
// again later. Remember what was sent so it never goes out twice.
const keyFor = (data) => JSON.stringify([data.type, data.email, data.question, data.summary, data.date, data.time]);
const readSent = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(SENT_KEY) || '[]'));
  } catch {
    return new Set();
  }
};
const markSent = (k) => {
  try {
    const s = readSent();
    s.add(k);
    localStorage.setItem(SENT_KEY, JSON.stringify([...s].slice(-50)));
  } catch {
    /* storage unavailable: worst case a re-render offers to send again */
  }
};

export async function sendToMelvin(data, messages = []) {
  const transcript = messages.map((m) => `[${String(m.role).toUpperCase()}]: ${m.content}`).join('\n\n');
  const lines = [
    `Type: ${data.type || 'Question for Melvin'}`,
    data.question && `Question / request: ${data.question}`,
    data.date && `Requested date: ${data.date}`,
    data.time && `Requested time: ${data.time}`,
    data.painPoints && `Pain points: ${data.painPoints}`,
    data.goals && `Goals: ${data.goals}`,
    data.summary && `Summary: ${data.summary}`,
    '',
    '--- CHAT TRANSCRIPT ---',
    transcript,
  ].filter((l) => l !== undefined && l !== null && l !== false);
  await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      to_name: 'Melvin',
      from_name: data.name || 'Website visitor',
      from_email: data.email || 'No email provided',
      subject: `MelBot: ${data.type || 'Question for Melvin'}${data.name ? ` from ${data.name}` : ''}`,
      message: lines.join('\n'),
      reply_to: data.email || '',
    },
    EMAILJS_PUBLIC_KEY,
  );
}

/** Status card for a SEND_EMAIL token: sends once, shows sending / sent / retry. */
export function EmailStatus({ data, messages }) {
  const k = keyFor(data);
  const [status, setStatus] = useState(() => (typeof window !== 'undefined' && readSent().has(k) ? 'success' : 'sending'));
  const started = useRef(false);
  const latest = useRef(messages);
  latest.current = messages;

  const send = async () => {
    setStatus('sending');
    try {
      await sendToMelvin(data, latest.current);
      markSent(k);
      setStatus('success');
    } catch (err) {
      console.error('EmailJS Error:', err);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (started.current || status === 'success') return;
    started.current = true;
    send();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const base = 'my-2 flex items-center gap-2 rounded-xl border p-3 text-sm';
  if (status === 'sending')
    return (
      <div className={`${base} border-[rgba(66,189,245,0.35)] bg-[rgba(66,189,245,0.1)] text-[#c4c8e8]`} role="status">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#42BDF5] border-t-transparent" aria-hidden />
        Sending your message to Melvin…
      </div>
    );
  if (status === 'success')
    return (
      <div className={`${base} border-[rgba(121,216,160,0.45)] bg-[rgba(121,216,160,0.1)] text-white`} role="status">
        <span aria-hidden>✓</span> Sent to Melvin. He'll reply to {data.email || 'you'} by email.
      </div>
    );
  return (
    <div className={`${base} border-[rgba(255,122,138,0.45)] bg-[rgba(255,122,138,0.1)] text-white`} role="alert">
      <span aria-hidden>!</span> Couldn't send just now.
      <button type="button" onClick={send} className="ml-auto rounded-lg bg-[#222850] px-2.5 py-1 font-semibold underline-offset-2 hover:underline">
        Try again
      </button>
    </div>
  );
}

/** Pull a SEND_EMAIL token out of a line. Returns { data, rest } or null. */
export function parseEmailToken(line) {
  // greedy: the JSON may contain "}" inside strings; the token sits on its own line
  const m = line.match(/:::SEND_EMAIL\|(\{.*\}):::/);
  if (!m) return null;
  try {
    return { data: JSON.parse(m[1]), rest: line.replace(m[0], '').trim() };
  } catch {
    return null;
  }
}
