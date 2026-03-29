const { supabase } = require("../config/supabaseClient");
const { google } = require("googleapis");


const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEYS);

const auth = new google.auth.GoogleAuth({
  // keyFile: path.join(process.cwd(), "credentials.json"),
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;


const getLeads = async (req, res) => {
  try {
    const { search, course, status } = req.query;
    console.log(search, course, status);
    let query = supabase.from("leads").select("*");

    
    if (search) {
      const safeSearch = search.replace(/[%_]/g, "");
      query = query.or(
        `name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%`
      );
    }

    // Filter by course
    if (course && course !== "All") {
      query = query.eq("course", course);
    }

    // Filter by status
    if (status && status !== "All") {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    res.status(200).json({
      success: true,
      leads: data,
    });
  } catch (error) {
    console.error("Get Leads Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
};



const updateLeadStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      const allowedStatus = ["new", "contacted"];
  
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }
  
      const { data, error } = await supabase
        .from("leads")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
  
      if (error) throw error;
  
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Lead not found",
        });
      }
  

      if (data.sheet_row_id) {
        await updateSheetStatus(data.sheet_row_id, status);
      }
  
      res.status(200).json({
        success: true,
        message: "Status updated",
        lead: data,
      });
    } catch (error) {
      console.error("Update Status Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update status",
      });
    }
  };


async function updateSheetStatus(rowId, status) {
    try {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `Leads!G${rowId}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[status]],
        },
      });
    } catch (error) {
      console.error("Sheet Update Error:", error);
      throw new Error("Failed to update Google Sheet");
    }
  }

  module.exports = {
    getLeads,
    updateLeadStatus,
  }