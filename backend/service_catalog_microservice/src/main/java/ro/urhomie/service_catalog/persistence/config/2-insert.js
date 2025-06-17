db = db.getSiblingDB("service_catalog");

db.service_categories.insertMany([
    {
        _id: "PLMB",
        name: "Plumbing",
        description: "Services related to pipes, faucets, leaks and installations.",
        imagePath: "/images/categories/plumbing.png"
    },
    {
        _id: "ELEC",
        name: "Electrical",
        description: "Installation and repair of electrical systems and devices.",
        imagePath: "/images/categories/electrical.png"
    },
    {
        _id: "CLNG",
        name: "Cleaning",
        description: "Professional home and office cleaning services.",
        imagePath: "/images/categories/cleaning.png"
    },
    {
        _id: "PNTG",
        name: "Painting",
        description: "Interior and exterior painting services.",
        imagePath: "/images/categories/painting.png"
    },
    {
        _id: "HVAC",
        name: "Heating & Cooling",
        description: "Installation and maintenance of HVAC systems.",
        imagePath: "/images/categories/hvac.png"
    },
    {
        _id: "GRDN",
        name: "Gardening",
        description: "Lawn care, plant maintenance and garden design.",
        imagePath: "/images/categories/gardening.png"
    },
    {
        _id: "MNTC",
        name: "General Maintenance",
        description: "Handyman and small repair services.",
        imagePath: "/images/categories/maintenance.png"
    },
    {
        _id: "CSTW",
        name: "Custom Work",
        description: "Custom, specialized, or creative work projects.",
        imagePath: "/images/categories/custom.png"
    }
]);

db.category_templates.insertMany([
    {
        categoryId: "PLMB",
        fields: [
            {
                name: "service_scope",
                label: "Service Scope",
                type: "select",
                options: ["installation", "repair", "maintenance"]
            },
            {
                name: "included_fixtures",
                label: "Included Fixtures",
                type: "multi-select",
                options: ["sink", "toilet", "bathtub", "pipes", "other"]
            }
        ]
    },
    {
        categoryId: "ELEC",
        fields: [
            {
                name: "electrical_services",
                label: "Type of Electrical Services",
                type: "multi-select",
                options: ["lighting", "wiring", "appliances", "panels", "outlets"]
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
            }
        ]
    },
    {
        categoryId: "MNTC",
        fields: [
            {
                name: "maintenance_type",
                label: "Maintenance Type",
                type: "select",
                options: ["preventive", "corrective", "inspection"]
            },
            {
                name: "covered_areas",
                label: "Covered Areas",
                type: "multi-select",
                options: ["interior", "exterior", "roof", "basement", "garage"]
            }
        ]
    },
    {
        categoryId: "CSTW",
        fields: [
        ]
    }
]);

db.services.insertMany([
    {
        providerId: 2,
        categoryId: "PLMB",
        title: "Bathroom Fixture Installation",
        description: "Professional installation of sinks, toilets, and bathtubs for your bathroom.",
        basePrice: 450.00,
        durationEstimate: "1d 4h",
        city: "Cluj-Napoca",
        address: "Strada Baii nr. 10",
        details: {
            service_scope: "installation",
            included_fixtures: ["sink", "toilet"]
        }
    },
    {
        providerId: 2,
        categoryId: "PLMB",
        title: "Pipe Leak Repair",
        description: "Efficient detection and repair of pipe leaks to prevent water damage.",
        basePrice: 300.00,
        durationEstimate: "1d 1h",
        city: "Cluj-Napoca",
        address: "Strada Reparatiei nr. 5",
        details: {
            service_scope: "repair",
            included_fixtures: ["pipes"]
        }
    },
    {
        providerId: 2,
        categoryId: "ELEC",
        title: "Lighting and Wiring Installation",
        description: "Safe installation of lights and electrical wiring for new or renovated homes.",
        basePrice: 600.00,
        durationEstimate: "2d 2h",
        city: "Cluj-Napoca",
        address: "Strada Electricitatii nr. 8",
        details: {
            electrical_services: ["lighting", "wiring"]
        }
    },
    {
        providerId: 2,
        categoryId: "MNTC",
        title: "General Home Maintenance",
        description: "Routine inspections and preventive maintenance for home safety and efficiency.",
        basePrice: 250.00,
        durationEstimate: "1d 0h",
        city: "Cluj-Napoca",
        address: "Strada Intretinerii nr. 3",
        details: {
            maintenance_type: "preventive",
            covered_areas: ["interior", "basement"]
        }
    },
    {
        providerId: 2,
        categoryId: "CSTW",
        title: "Custom Renovation Project",
        description: "Tailored renovation service for non-standard or creative home improvements.",
        basePrice: 900.00,
        durationEstimate: "3d 0h",
        city: "Cluj-Napoca",
        address: "Strada Creatiei nr. 1",
        details: {}
    },
    {
        providerId: 3,
        categoryId: "CLNG",
        title: "Post-Renovation Cleaning",
        description: "Thorough cleaning of construction debris and dust after renovation projects.",
        basePrice: 380.00,
        durationEstimate: "1d 5h",
        city: "București",
        address: "Strada Curateniei nr. 12",
        details: {
            cleaning_type: "post-renovation",
            frequency: "once"
        }
    },
    {
        providerId: 3,
        categoryId: "PNTG",
        title: "Interior Room Painting",
        description: "High-quality painting services for living rooms, bedrooms, and kitchens.",
        basePrice: 500.00,
        durationEstimate: "2d 0h",
        city: "București",
        address: "Strada Culorii nr. 7",
        details: {
            number_of_rooms: 3
        }
    },
    {
        providerId: 3,
        categoryId: "HVAC",
        title: "HVAC Filter Cleaning",
        description: "Filter cleaning and air quality check for HVAC systems.",
        basePrice: 280.00,
        durationEstimate: "0d 6h",
        city: "București",
        address: "Strada Ventilatiei nr. 15",
        details: {
            service_type: "filter cleaning"
        }
    },
    {
        providerId: 3,
        categoryId: "GRDN",
        title: "Lawn and Garden Care",
        description: "Complete care of your garden including watering, weeding, and trimming.",
        basePrice: 350.00,
        durationEstimate: "1d 2h",
        city: "București",
        address: "Strada Florilor nr. 22",
        details: {
            area_size: 150
        }
    },
    {
        providerId: 3,
        categoryId: "ELEC",
        title: "Electrical Panel Installation",
        description: "Professional installation and setup of home electrical panels.",
        basePrice: 700.00,
        durationEstimate: "2d 4h",
        city: "București",
        address: "Strada Panoului nr. 9",
        details: {
            electrical_services: ["panels", "appliances"]
        }
    }
]);