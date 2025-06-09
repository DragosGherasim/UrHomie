db = db.getSiblingDB("service_catalog");

db.service_categories.insertMany([
    {
        _id: "PLMB",
        name: "Plumbing",
        description: "Services related to pipes, faucets, leaks and installations.",
        imagePath: "/images/categories/plumbing.jpg"
    },
    {
        _id: "ELEC",
        name: "Electrical",
        description: "Installation and repair of electrical systems and devices.",
        imagePath: "/images/categories/electrical.jpg"
    },
    {
        _id: "CLNG",
        name: "Cleaning",
        description: "Professional home and office cleaning services.",
        imagePath: "/images/categories/cleaning.jpg"
    },
    {
        _id: "PNTG",
        name: "Painting",
        description: "Interior and exterior painting services.",
        imagePath: "/images/categories/painting.jpg"
    },
    {
        _id: "HVAC",
        name: "Heating & Cooling",
        description: "Installation and maintenance of HVAC systems.",
        imagePath: "/images/categories/hvac.jpg"
    },
    {
        _id: "GRDN",
        name: "Gardening",
        description: "Lawn care, plant maintenance and garden design.",
        imagePath: "/images/categories/gardening.jpg"
    },
    {
        _id: "MNTC",
        name: "General Maintenance",
        description: "Handyman and small repair services.",
        imagePath: "/images/categories/maintenance.jpg"
    },
    {
        _id: "CSTW",
        name: "Custom Work",
        description: "Custom, specialized, or creative work projects.",
        imagePath: "/images/categories/custom.jpg"
    }
]);

db.category_templates.insertMany([
    {
        categoryId: "PLMB",
        fields: [
            {
                name: "sink_type",
                label: "Sink Type",
                type: "select",
                options: ["single", "double"]
            },
            {
                name: "installation_type",
                label: "Installation Type",
                type: "select",
                options: ["countertop", "wall-mounted"]
            }
        ]
    },
    {
        categoryId: "ELEC",
        fields: [
            {
                name: "device_type",
                label: "Device Type",
                type: "text"
            },
            {
                name: "requires_certified_electrician",
                label: "Requires Certified Electrician?",
                type: "checkbox"
            }
        ]
    },
    {
        categoryId: "CLNG",
        fields: [
            {
                name: "cleaning_type",
                label: "Cleaning Type",
                type: "select",
                options: ["general", "post-renovation", "deep"]
            },
            {
                name: "frequency",
                label: "Frequency",
                type: "select",
                options: ["once", "weekly", "monthly"]
            }
        ]
    },
    {
        categoryId: "PNTG",
        fields: [
            {
                name: "number_of_rooms",
                label: "Number of Rooms",
                type: "number"
            },
            {
                name: "paint_type",
                label: "Paint Type",
                type: "text"
            },
            {
                name: "color_options",
                label: "Color Options",
                type: "multi-select",
                options: ["white", "gray", "green", "blue", "custom"]
            }
        ]
    },
    {
        categoryId: "HVAC",
        fields: [
            {
                name: "service_type",
                label: "Service Type",
                type: "select",
                options: ["installation", "maintenance", "filter cleaning"]
            },
            {
                name: "device_model",
                label: "Device Model",
                type: "text"
            }
        ]
    },
    {
        categoryId: "GRDN",
        fields: [
            {
                name: "area_size",
                label: "Area Size (sqm)",
                type: "number"
            },
            {
                name: "seasonal_service",
                label: "Seasonal Service?",
                type: "checkbox"
            }
        ]
    },
    {
        categoryId: "MNTC",
        fields: [
            {
                name: "task_description",
                label: "Task Description",
                type: "text"
            },
            {
                name: "tools_provided",
                label: "Tools Provided?",
                type: "checkbox"
            }
        ]
    },
    {
        categoryId: "CSTW",
        fields: [
            {
                name: "custom_details",
                label: "Custom Details",
                type: "textarea"
            },
            {
                name: "estimated_duration",
                label: "Estimated Duration",
                type: "text"
            }
        ]
    }
]);