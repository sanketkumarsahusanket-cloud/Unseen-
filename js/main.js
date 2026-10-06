// Supabase credentials lagayein yahan
const SUPABASE_URL = 'https://rmbygwjrmdaopsyvqtgk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_TTYbbeguh02DiyaPiL6FRg_0lGFcEXo';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const videoElement = document.getElementById('main-video');
const playBtn = document.getElementById('play-btn');
const videoOverlay = document.getElementById('video-overlay');

async function fetchVideoUrl() {
    // Database se video URL fetch karein
    const { data, error } = await supabase
        .from('Site_settings')
        .select('file_url')
        .eq('key_name', 'password_video')
        .single();

    if (error) {
        "alert(error.message);"
        return;
    }

    if (data) {
        videoElement.src = data.file_url;
    }
}

fetchVideoUrl();

playBtn.addEventListener('click', () => {
    videoElement.play();
    videoOverlay.style.display = 'none';
});
