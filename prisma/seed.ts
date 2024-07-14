import { Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

import { ECasePriority, ECaseStatus, ECaseType } from '../libs/cases/shared/models/src';
import pump2envData from './demo_data/PUMP-002_Environment_20240422-220000000_20240423-220000000.json';
import pump2pumpData from './demo_data/PUMP-002_PumpData_20240422-220000000_20240423-220000000.json';
import pump10envData from './demo_data/PUMP-010_Environment_20240422-220000000_20240423-220000000.json';
import pump10pumpData from './demo_data/PUMP-010_PumpData_20240422-220000000_20240423-220000000.json';

const prisma = new PrismaClient();

const facilityConst = [
    { name: 'totally legal waste disposal', description: 'We ensure environmentally responsible and completely legitimate waste disposal services.' },
    { name: 'Dribble & Drizzle Station', description: 'A captivating large aquarium located in the Computer Science Department building.' },
    { name: 'Waste Water Processing', description: 'Advanced facility dedicated to efficient and eco-friendly waste water treatment.' },
    { name: 'Submarine Solutions', description: 'Cutting-edge submarine testing facility focused on innovation and safety.' },
    { name: 'Gush & Flush' , description: 'Specialized overflow management services in Truth or Consequences, ensuring smooth and safe water flow.' },
    { name: 'Well, Well, Well', description: 'State-of-the-art water pump facility designed to provide sustainable and reliable access to clean water.' },
    { name: 'Drop Zone', description: 'Efficient and reliable water delivery service ensuring residents have access to clean water when they need it most.' },
    { name: 'H2-Whoa Facility', description: ' A high-tech facility known for its impressive and groundbreaking water processing solutions.' },
    { name: 'Bucket Brigade', description: 'Reliable emergency water supply service ensuring access to water during critical situations.' },
];

faker.seed(1234);

const facilities = facilityConst.map((facility, index) => {
    return {
        name: facility.name,
        assetId: faker.string.uuid(),
        description: facility.description,
        typeId: 'pump',
        indicatorMsg: 'Everything works fine',
    };
});

const CasesConst = [
    { title: 'Pump Repair Needed', description: 'The pump is damaged and is operating at a fraction of its original capacity' },
    { title: 'Overflow Alarm', description: 'The overflow sensor is malfunctioning and causing false alarms' },
    { title: 'Leak Detection', description: 'A significant leak has been detected in the main pipeline' },
    { title: 'Pressure Drop', description: 'Sudden pressure drop in the system is affecting water distribution' },
    { title: 'Filter Replacement', description: 'The water filters are clogged and need immediate replacement' },
    { title: 'Valve Malfunction', description: 'A critical valve is stuck and preventing proper water flow' },
    { title: 'Contamination Alert', description: 'Water tests have shown signs of contamination in the supply' },
    { title: 'Pump Overheating', description: 'The pump is overheating due to continuous operation and insufficient cooling' },
    { title: 'Sensor Calibration', description: 'Sensors need recalibration to ensure accurate readings' },
    { title: 'Electrical Fault', description: 'An electrical fault has caused a shutdown of the main control panel' },
    { title: 'Water Hammer Issue', description: 'Experiencing water hammer effect causing pipe vibrations and noise' },
    { title: 'System Upgrade', description: 'The system requires an upgrade to handle increased water demand' },
    { title: 'Backup Generator Failure', description: 'The backup generator has failed and needs urgent repair' },
    { title: 'Water Quality Testing', description: 'Routine water quality testing has detected abnormal levels of contaminants' },
    { title: 'Flow Rate Anomaly', description: 'Unexplained fluctuations in water flow rate require investigation' },
];

// still requires the assetId to be added
const cases = CasesConst.map((caseItem, index) => {
    return {
        handle: 'AA-' + faker.number.int({ min: 1000, max: 9999 }),
        dueDate: faker.date.soon({ days: 30}),
        status: ECaseStatus.OPEN,
        title: caseItem.title,
        description: caseItem.description,
        type: faker.helpers.enumValue(ECaseType),
        source: 'Internal System ' + faker.number.int({min: 1, max: 10}),
        priority: faker.helpers.enumValue(ECasePriority),
        createdBy: faker.internet.email(),
        eTag: faker.string.alphanumeric(10),
    };
});

async function seedSingleFacility({
                                      name,
                                      assetId,
                                      description,
                                      typeId,
                                      index,
                                      indicatorMsg,
                                  }: {
    name: string;
    assetId: string;
    description: string;
    typeId: string;
    index: number;
    indicatorMsg: string;
}) {
    const pumpData = index % 2 === 0 ? pump2pumpData : pump10pumpData;
    const envData = index % 2 === 0 ? pump2envData : pump10envData;

    const asset = await prisma.asset.create({
        data: {
            assetId,
            name,
            typeId,
            description,
            indicatorMsg,
            location: {
                create: {
                    latitude: faker.location.latitude(),
                    longitude: faker.location.longitude(),
                    country: faker.location.country(),
                    region: faker.location.state(),
                    streetAddress: faker.location.streetAddress(),
                    postalCode: faker.location.zipCode(),
                    locality: faker.location.city(),
                },
            },
            variables: {},
        },
    });

    const tsItemPumpData = await prisma.timeSeriesItem.create({
        data: {
            assetId: asset.assetId,
            propertySetName: 'PumpData',
            variables: [
                {
                    name: 'Flow',
                    unit: 'l/s',
                },
                {
                    name: 'MotorCurrent',
                    unit: 'V',
                },
                {
                    name: 'PressureIn',
                    unit: 'hPa',
                },
                {
                    name: 'PressureOut',
                    unit: 'hPa',
                },
                {
                    name: 'StuffingBoxTemperature',
                    unit: '°C',
                },
            ],
        },
    });

    const newPumpData = pumpData.map((data: any) => {
        return {
            time: new Date(data._time),

            timeSeriesItemAssetId: tsItemPumpData.assetId,
            timeSeriesItemPropertySetName: tsItemPumpData.propertySetName,

            data: {
                MotorCurrent: data.MotorCurrent,
                PressureOut: data.PressureOut,
                StuffingBoxTemperature: data.StuffingBoxTemperature,
                PressureIn: data.PressureIn,
                Flow: data.Flow,
            } as Prisma.JsonObject,
        };
    });

    const tSItemEnv = await prisma.timeSeriesItem.create({
        data: {
            assetId: asset.assetId,
            propertySetName: 'Environment',
            variables: [
                {
                    name: 'Humidity',
                    unit: '%',
                },
                {
                    name: 'Pressure',
                    unit: 'kPa',
                },
                {
                    name: 'Temperature',
                    unit: '°C',
                },
            ],
        },
    });

    const newEnvData = envData.map((data: any) => {
        return {
            time: new Date(data._time),

            timeSeriesItemAssetId: asset.assetId,
            timeSeriesItemPropertySetName: tSItemEnv.propertySetName,

            data: {
                PressureQc: data.Pressure_qc,
                Temperature: data.Temperature,
                TemperatureQc: data.Temperature_qc,
                HumidityQc: data.Humidity_qc,
                Humidity: data.Humidity,
                Pressure: data.Pressure,
            } as Prisma.JsonObject,
        };
    });

    // Seed database with timeseries data
    await prisma.timeSeriesDataItem.createMany({
        data: [newPumpData, newEnvData].flat(),
    });

    // create new case data from JSON file
    const caseData = faker.helpers.arrayElements(cases, { min: 0, max: 2 })
    const newCaseData = caseData.map((data: any) => {
        return {
            handle: data.handle,
            dueDate: data.dueDate,
            title: data.title,
            type: data.type,
            status: data.status,
            description: data.description,
            source: data.source,
            priority: data.priority,
            createdBy: data.createdBy,
            eTag: data.eTag,
            assetAssetId: asset.assetId,
        };
    });

    // Seed database with case data
    await prisma.case.createMany({
        data: newCaseData,
    });
}

async function main() {
    // Seed database with facility data
    for (let i = 0; i < facilities.length; i++) {
        await seedSingleFacility({ ...facilities[i], index: i });
    }
}

main().catch((e) => {
    console.error(e);

    process.exit(1);
});
