import { createClient } from "@supabase/supabase-js";

// console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);

const authUrl = ``;

const url = process.env.REACT_APP_SUPABASE_URL!;
const anonKey = process.env.REACT_APP_SUPABASE_KEY!;

// const url = "https://sorcthuycbkwhrnjbntk.supabase.co";
// const key =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvcmN0aHV5Y2Jrd2hybmpibnRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjYyOTMzOTAsImV4cCI6MTk4MTg2OTM5MH0.r3a-Eh4ih64kq-_ir2CgApjDLUqJCfHMtC2n23y9_KE";
// console.log(url);

export const supabase = createClient(`${url}`, anonKey);
