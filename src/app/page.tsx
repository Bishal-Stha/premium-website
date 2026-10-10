export const instant = false;
import { supabase } from '@/lib/supabase'
import ScrollyCanvas from './ScrollyCanvas'


export default async function Home() {
  const { data: chapters, error } = await supabase
    .from('scroll_chapters')
    .select('*')
    .order('frame_start', { ascending: true })
    
  if (error) {
    console.error('Error fetching chapters:', error)
  }

  return (
    <main className="bg-black text-white min-h-screen">
      <ScrollyCanvas chapters={chapters || []} />
    </main>
  )
}
