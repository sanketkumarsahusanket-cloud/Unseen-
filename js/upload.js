// Supabase credentials lagayein yahan
const SUPABASE_URL = 'https://rmbygwjrmdaopsyvqtgk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_TTYbbeguh02DiyaPiL6FRg_0lGFcEXo';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('upload-form');
const fileInput = document.getElementById('file-input');
const fileType = document.getElementById('file-type');
const statusMsg = document.getElementById('status-msg');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const file = fileInput.files[0];
    const type = fileType.value;

    if (!file || !type) {
        statusMsg.textContent = 'Please select a file and type!';
        return;
    }

    statusMsg.textContent = 'Uploading file...';

    const fileName = `${Date.now()}_${file.name}`;

    // 1. Media storage bucket mein file upload karein
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media-storage')
        .upload(fileName, file);

    if (uploadError) {
        statusMsg.textContent = 'Upload failed: ' + uploadError.message;
        return;
    }

    // 2. File ka public URL nikalein
    const { data: urlData } = supabase.storage
        .from('media-storage')
        .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // 3. Site_settings table mein data save karein
    const { error: dbError } = await supabase
        .from('Site_settings')
        .insert([
            { key_name: type, file_url: publicUrl }
        ]);

    if (dbError) {
        statusMsg.textContent = 'Database error: ' + dbError.message;
    } else {
        statusMsg.textContent = 'Upload successful!';
        form.reset();
    }
});
