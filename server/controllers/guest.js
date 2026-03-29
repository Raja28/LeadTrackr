const { supabase } = require("../config/supabaseClient");
const { google } = require('googleapis');
require("dotenv").config();

const guestEnrollmentRequest = async (req, res) => {
    try {
        const { name, email, phone, course, college, year } = req.body;
        console.log("Guest Enrollment Request work in progress....");

        if (!name || !email || !phone || !course || !college || !year) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        // Check if the email is already in the database (Already Registered)
        const { data: existingUser, error: existingUserError } = await supabase
            .from("leads")
            .select("*")
            .eq("email", email)
            .maybeSingle();

        if (existingUserError) {
            console.error("Database Error:", existingUserError);
            return res.status(500).json({ success: false, message: "Internal server error..." });
        }

        // existingUser exists
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Already Registered",
            });
        }

        const sheetRowId = await appendLeadToSheet({
            name,
            email,
            phone,
            course,
            college,
            year,
            status: "new",
            created_at: new Date().toISOString(),
        });

        if (!sheetRowId) {
            return res.status(500).json({
                success: false,
                message: "Failed to sync with Google Sheets",
            });
        }

        // Create a new lead
        const { data: newLead, error: newLeadError } = await supabase.from("leads").insert({
            name,
            email,
            phone,
            course,
            college,
            year,
            sheet_row_id: sheetRowId,

        });
        if (newLeadError) {
            console.error("Lead Creation Error:", newLeadError);
            return res.status(500).json({
                success: false,
                message: "Failed to create lead...",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Lead created successfully",
            data: newLead,
        });

    } catch (error) {
        console.log("Guest Enrollment Request Error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}


// 1. Setup Auth

const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEYS);
const auth = new google.auth.GoogleAuth({
    // keyFile: path.join(process.cwd(), 'credentials.json'),
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

async function appendLeadToSheet(leadData) {
    try {

        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Leads!A:H',
            valueInputOption: 'USER_ENTERED',
            // resource: {
            requestBody: {
                values: [[
                    leadData.name,
                    leadData.email,
                    leadData.phone,
                    leadData.course,
                    leadData.college,
                    leadData.year,
                    leadData.status,
                    leadData.created_at,
                    // new Date().toISOString()
                    // new Date().toLocaleDateString('en-GB')
                ]],
            },
        });


        const rowId = response.data.updates.updatedRange.split('!')[1].split(':')[0].replace(/\D/g, '');

        return parseInt(rowId);
    } catch (error) {
        console.error('Google Sheets Error:', error);
        throw new Error('Failed to sync with Google Sheets');
    }
}


// const testpath = async (req, res) => {
//     try {
//         const credsPath =  path.join('credentials.json');
//         console.log("Path", credsPath);
//         console.log("Path", path.join(process.cwd(), 'credentials.json'),);
//         return res.status(200).json({
//             success: true,
//             message: "Path testing successful",
//             data: credsPath,
//         });
//     } catch (error) {
//         console.log("Testpath Error", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//         });
//     }
// }


module.exports = {
    guestEnrollmentRequest,
    appendLeadToSheet,
    // testpath,
}