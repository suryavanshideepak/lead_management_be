const leadsModel = require('../models/leadsModel')
const userModel = require('../models/userModel')
const assignModel = require('../models/assignedLeadModel')

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
            let { page, limit, desposition, search, userId, fromDate, toDate } = req.query
            console.log(userId)
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

            if(fromDate || toDate){
                filter.created_at = {}
                if(fromDate){
                    filter.created_at.$gte = new Date(fromDate);
                }
                if(toDate){
                    const toDateObj = new Date(toDate)
                    toDateObj.setHours(23,59,59,999);
                    filter.created_at.$lte = toDateObj;
                }
            }

            if(userId){
                const assignedLeads = await assignModel.find({userId})
                console.log(assignedLeads)
                const leadIds = assignedLeads.flatMap((item) => item.leadIds);
                console.log(leadIds)
                if(leadIds.length >0){
                    filter._id = { $in : leadIds };
                }
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

    getLeadById: async (req, res, next) => {
        try {
            const { id } = req.params;
    
            if (!id) {
                return res.status(400).json({ success: false, message: "Lead ID is required" });
            }
    
            const lead = await leadsModel.findById(id);
    
            if (!lead) {
                return res.status(404).json({ success: false, message: "Lead not found" });
            }
    
            res.status(200).json({
                success: true,
                message: "Lead fetched successfully",
                data: lead
            });
    
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal server error", error: error.message });
        }
    },

   assignLead: async (req, res, next) => {
    const { leadIds, userId } = req.body;

    try {
        if (!Array.isArray(leadIds) || leadIds.length === 0) {
            return res.status(400).json({ success: false, message: "leadIds must be an array with at least one lead ID" });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const leads = await leadsModel.find({ _id: { $in: leadIds } });
        if (leads.length !== leadIds.length) {
            return res.status(404).json({ success: false, message: "Some leads not found" });
        }

        await assignModel.updateMany(
            { leadIds: { $in: leadIds } },
            { $pull: { leadIds: { $in: leadIds } } }
        );

        let assignedLeads = await assignModel.findOne({ userId });

        if (assignedLeads) {
            assignedLeads.leadIds = [...new Set([...assignedLeads.leadIds, ...leadIds])]; 
            assignedLeads.updated_at = new Date();
            await assignedLeads.save();
        } else {
            assignedLeads = new assignModel({ leadIds, userId });
            await assignedLeads.save();
        }

        res.status(201).json({
            success: true,
            message: "Leads assigned successfully",
            data: assignedLeads,
        });

        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
        }
    },

    getAllAssignee: async (req, res, next) => {
        try{
            const assigneeData = await assignModel.find()
            return res.status(200).json({ assigneeData: assigneeData})
        }catch(error){
            return res.status(500).send()
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