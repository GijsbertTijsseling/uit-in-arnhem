import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ldvclkymaiopytbkjulp.supabase.co';
const supabaseKey = 'sb_publishable_v4FLLzJvOTLRr_FNyqreQg_pWyBfHvp';

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log('Testing Supabase Connection & Data Fetching...');

  // 1. Articles
  const { data: articles, count: artCount, error: artErr } = await supabase
    .from('articles')
    .select('id, slug, title, status', { count: 'exact' })
    .limit(5);

  if (artErr) {
    console.error('Articles fetch error:', artErr);
  } else {
    console.log(`✓ Articles fetched: ${artCount} total in DB, sample: "${articles[0]?.title}" (${articles[0]?.slug})`);
  }

  // 2. Events
  const { data: events, count: evCount, error: evErr } = await supabase
    .from('events')
    .select('id, slug, title, start_date', { count: 'exact' })
    .limit(5);

  if (evErr) {
    console.error('Events fetch error:', evErr);
  } else {
    console.log(`✓ Events fetched: ${evCount} total in DB, sample: "${events[0]?.title}" (${events[0]?.slug})`);
  }

  // 3. Categories
  const { data: categories, error: catErr } = await supabase
    .from('categories')
    .select('id, name, slug');

  if (catErr) {
    console.error('Categories fetch error:', catErr);
  } else {
    console.log(`✓ Categories fetched: ${categories.length} categories`);
  }

  // 4. Test Storage Media Bucket upload
  console.log('Testing Supabase Storage upload to `media` bucket...');
  const testFileName = `test-verify-${Date.now()}.txt`;
  const fileContent = Buffer.from('Uit in Arnhem verification test content');

  const { data: uploadData, error: uploadErr } = await supabase.storage
    .from('media')
    .upload(testFileName, fileContent, {
      contentType: 'text/plain',
      upsert: true,
    });

  if (uploadErr) {
    console.error('Storage upload failed:', uploadErr);
  } else {
    console.log('✓ Storage upload successful:', uploadData.path);
    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(uploadData.path);
    console.log('✓ Public URL generated:', publicUrlData.publicUrl);

    // Clean up
    const { error: deleteErr } = await supabase.storage
      .from('media')
      .remove([uploadData.path]);
    if (deleteErr) {
      console.warn('Storage cleanup warning:', deleteErr);
    } else {
      console.log('✓ Storage test file cleaned up');
    }
  }

  return {
    articles: artCount,
    events: evCount,
    categories: categories?.length,
    sampleArticleSlug: articles?.[0]?.slug,
    sampleEventSlug: events?.[0]?.slug,
  };
}

runTests().then((res) => {
  console.log('Test summary:', res);
  process.exit(0);
}).catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

