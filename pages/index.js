import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Home() {
  const [items, setItems] = useState([])

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(10)
        if (error) throw error
        setItems(data || [])
      } catch (e) {
        console.error('Supabase error', e.message)
      }
    }
    load()
  }, [])

  return (
    <main style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Renoverde — Live Preview</h1>
      <p>Connected to Supabase at <code>{supabaseUrl}</code></p>
      <section>
        <h2>Latest posts</h2>
        {items.length === 0 ? (
          <p>No posts yet. Create a `posts` table in Supabase and add rows.</p>
        ) : (
          <ul>
            {items.map((p) => (
              <li key={p.id}><strong>{p.title}</strong> — {p.content}</li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
