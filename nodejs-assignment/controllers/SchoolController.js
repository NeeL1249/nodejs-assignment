const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SchoolController {
    async createSchool(req, res) {
        try{
            const { name , address , latitude , longitude } = req.body;
            if (!name || !address || !latitude || !longitude) {
                res.status(400).json({message: 'Please provide all the fields'});
            }
            await prisma.school.create({
                data: {
                    name: name,
                    address: address,
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                },
            });
            res.status(200).json({message: 'School created successfully'});
        } catch (error) {
            console.log(error);
            res.status(500).json({message: 'Internal server error'});
        }
    }
    async listSchools(req, res) {
        try {
            console.log(req.query);
            const { userLatitude, userLongitude } = req.query;

            if (!userLatitude || !userLongitude) {
                return res.status(400).json({ message: 'Please provide user latitude and longitude' });
            }

            const allSchools = await prisma.school.findMany();

            const schoolsWithDistance = allSchools.map(school => {
                const distance = this.calculateDistance(
                    userLatitude,
                    userLongitude,
                    school.latitude,
                    school.longitude
                );
                return { ...school, distance };
            });

            const sortedSchools = schoolsWithDistance.sort((a, b) => a.distance - b.distance);

            res.status(200).json({ schools: sortedSchools });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(0));
        const distance = R * c;
        return distance;
    }
}

module.exports = { SchoolController };