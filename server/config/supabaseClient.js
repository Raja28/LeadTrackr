const { createClient } = require('@supabase/supabase-js')
require("dotenv").config()

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

supabase.auth.getSession().then(({ error }) => {
    if (error) {
        console.error("❌ Supabase connection error:", error.message);
    } else {
        console.log("✅ Supabase Client Initialized & Connected");
    }
});

module.exports = { supabase }