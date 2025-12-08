import fs from 'fs';
import csv from 'csv-parser';


// => is used for function to ensure a cleaner and shorter code
// Higher-order function for filtering
const filterBy = (criteria) => 
    (vehicles) => vehicles.filter(criteria);

// Curried function for price range filtering (Applying Currying)
const priceRange = (min) => (max) => (vehicle) => 
    vehicle.Selling_Price >= min && vehicle.Selling_Price <= max;

// Curried function for fuel type filtering  
const fuelType = (type) => 
    (vehicle) => vehicle.Fuel_Type === type;

// Map function for applying markup (Applying Purity)
const applyMarkup = (percentage) => (vehicles) => 
    vehicles.map(vehicle => ({
        ...vehicle, 
        Selling_Price: Math.round(vehicle.Selling_Price * (1 + percentage/100))
    }));

// Sort function
// By applying ...vehicles we ensure purity by making a copy)
const sortByPrice = (vehicles) => 
    [...vehicles].sort((a, b) => a.Selling_Price - b.Selling_Price);

// Reduce for counting by criteria
const countBy = (criteria) => (vehicles) => 
    vehicles.reduce((count, vehicle) => criteria(vehicle) ? count + 1 : count, 0);

// Reduce for statistics
const calculateStats = (vehicles) => vehicles.reduce((stats, vehicle) => ({
    total: stats.total + 1,
    totalValue: stats.totalValue + vehicle.Selling_Price,
    maxPrice: Math.max(stats.maxPrice, vehicle.Selling_Price),
    minPrice: Math.min(stats.minPrice, vehicle.Selling_Price)
}), {total: 0, totalValue: 0, maxPrice: 0, minPrice: Infinity});

// Function composition helper
const compose = (...functions) => (data) => 
    functions.reduceRight((result, fn) => fn(result), data);

// MAIN ANALYSIS FUNCTION
const analyzeCarSales = (vehicleData) => {
    console.log("CAR SALES FUNCTIONAL PROGRAMMING ANALYSIS");
    console.log("==============================================");
    
    // 1. Display all vehicles (Limit to first 5 to avoid spamming terminal)
    console.log("\n PREVIEW OF VEHICLES (First 5):");
    vehicleData.slice(0, 5).forEach(car => 
        console.log(`${car.Car_Name} (${car.Year}) - RM${car.Selling_Price.toLocaleString()} - ${car.Fuel_Type}`));
    
    // 2. Search vehicles in price range (0 - 300,000)
    console.log("\n VEHICLES UNDER 300,000:");
    const affordableCars = filterBy(priceRange(0)(300000))(vehicleData);
    affordableCars.slice(0, 5).forEach(car => 
        console.log(`  • ${car.Car_Name} - RM${car.Selling_Price.toLocaleString()}`));
    
    // 3. Count vehicles by fuel type
    const petrolCount = countBy(fuelType("Petrol"))(vehicleData);
    const dieselCount = countBy(fuelType("Diesel"))(vehicleData);
    
    console.log("\n FUEL TYPE DISTRIBUTION:");
    console.log(`  Petrol: ${petrolCount} vehicles`);
    console.log(`  Diesel: ${dieselCount} vehicles`);
    
    // 4. Sort vehicles by price
    console.log("\n CHEAPEST VEHICLES (Top 3):");
    const sortedCars = sortByPrice(vehicleData);
    sortedCars.slice(0, 3).forEach(car => 
        console.log(`  • ${car.Car_Name} - RM${car.Selling_Price.toLocaleString()}`));
    
    // 5. Apply 10% markup
    console.log("\n PRICES AFTER 10% MARKUP (Top 3):");
    const markedUpCars = applyMarkup(10)(vehicleData);
    markedUpCars.slice(0, 3).forEach(car => 
        console.log(`  • ${car.Car_Name} - RM${car.Selling_Price.toLocaleString()}`));
    
    // 6. Statistics
    const stats = calculateStats(vehicleData);
    const averagePrice = stats.totalValue / stats.total;
    
    console.log("\n STATISTICAL ANALYSIS:");
    console.log(`  Total Vehicles: ${stats.total}`);
    console.log(`  Average Price: RM${Math.round(averagePrice).toLocaleString()}`);
    console.log(`  Highest Price: RM${stats.maxPrice.toLocaleString()}`);
    console.log(`  Lowest Price: RM${stats.minPrice.toLocaleString()}`);
    
    // 7. Composition Example
    console.log("\n FUNCTION COMPOSITION EXAMPLE:");
    console.log("(Filter Diesel + Sort by Price + Take First 3)");
    
    const composedAnalysis = compose(
        (cars) => cars.slice(0, 3),
        sortByPrice,
        filterBy(fuelType("Diesel"))
    );
    
    const result = composedAnalysis(vehicleData);
    result.forEach(car => 
        console.log(`  • ${car.Car_Name} - RM${car.Selling_Price.toLocaleString()}`));
};

// Load from CSV
const loadFromCSV = () => {
    const results = [];
    // Reads the csv file
    fs.createReadStream('../data/CAR_DETAILS_FROM_CAR_DEKHO.csv') 
        .pipe(csv()) //Makes the raw data into JS code
        .on('data', (data) => { //Making all "string" into numbers
            results.push({
                Car_Name: data.name,
                Year: parseInt(data.year),
                Selling_Price: parseInt(data.selling_price),
                Fuel_Type: data.fuel,
                Transmission: data.transmission
            });
        })
        .on('end', () => { //Once its done, continue
            console.log("\n CSV Data loaded..");
            console.log("================================================");
            if (results.length > 0) {
                analyzeCarSales(results); //Starts the analysis function
            } else {
                console.log("Error: No data found in CSV!");
            }
        })
        .on('error', (err) => {
            console.error("File Read Error:", err.message);
        });
};

loadFromCSV(); //Activates the function