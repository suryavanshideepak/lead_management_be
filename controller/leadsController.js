const leadsModel = require('../models/leadsModel')

module.exports = {
    createLead: async (req, res, next) => {
        try {
            const { email, phone, name, address, city, state, pincode, product, disposition, status } = req.body
            
            if (!phone) {
                return res.status(400).json({ success: false, message: 'phone is required' })
            }
            const newLead = new leadsModel({
                email,
                phone,
                name,
                address,
                city,
                state,
                pincode,
                product,
                disposition,
                status
            })
            const savedLead = await newLead.save()
    
            res.status(201).json({ success: true, message: 'Lead created successfully', data: savedLead })
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ success: false, message: 'Email or phone already exists' })
            }
            res.status(500).json({ success: false, message: 'Internal server error', error: error.message })
        }
    },

    getAllLeads:async(req, res,next) => {
        try {
            let { page, limit, desposition, search } = req.query
    
            page = parseInt(page) || 1
            limit = parseInt(limit) || 10
    
            if (page < 1 || limit < 1) {
                return res.status(400).json({ success: false, message: 'Page and limit must be positive numbers' })
            }
            let filter = {}
            
            if (desposition) {
                filter.desposition = desposition
            }
    
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } } 
                ]
            }
    
            const totalLeads = await leadsModel.countDocuments(filter)
    
            const leads = await leadsModel.find(filter)
                .skip((page - 1) * limit)
                .limit(limit)
                .sort({ created_at: -1 })
    
            res.status(200).json({
                success: true,
                message: 'Leads fetched successfully',
                page,
                limit,
                totalLeads,
                totalPages: Math.ceil(totalLeads / limit),
                data: leads
            })
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error', error: error.message })
        }
    },

    importLeadsFromCsv: async (req, res, next) => {
        try {
            console.log(req.body)
            let leadsData = req.body.leads; 
            console.log(leadsData)
            if (!Array.isArray(leadsData) || leadsData.length === 0) {
                return res.status(400).json({ success: false, message: "Invalid or empty data" });
            }
    
            const insertedLeads = await leadsModel.insertMany(leadsData);
    
            res.status(201).json({
                success: true,
                message: "Leads added successfully",
                data: insertedLeads
            });
        } catch (error) {
            console.error("Error in bulk insert:", error);
            res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
        }
    }
}