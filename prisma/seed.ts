import { Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

import pump2envData from './demo_data/PUMP-002_Environment_20240422-220000000_20240423-220000000.json';
import pump2pumpData from './demo_data/PUMP-002_PumpData_20240422-220000000_20240423-220000000.json';
import pump10envData from './demo_data/PUMP-010_Environment_20240422-220000000_20240423-220000000.json';
import pump10pumpData from './demo_data/PUMP-010_PumpData_20240422-220000000_20240423-220000000.json';

const prisma = new PrismaClient();

const facilityConst = [
	{
		name: 'Dribble & Drizzle Station',
		description:
			'A captivating large aquarium located in the Computer Science Department building.',
	},
	{
		name: 'Waste Water Processing',
		description:
			'Advanced facility dedicated to efficient and eco-friendly waste water treatment.',
	},
	{
		name: 'Submarine Solutions',
		description: 'Cutting-edge submarine testing facility focused on innovation and safety.',
	},
	{
		name: 'Gush & Flush',
		description:
			'Specialized overflow management services in Truth or Consequences, ensuring smooth and safe water flow.',
	},
	{
		name: 'Well, Well, Well',
		description:
			'State-of-the-art water pump facility designed to provide sustainable and reliable access to clean water.',
	},
	{
		name: 'Totally legal waste disposal',
		description:
			'We ensure environmentally responsible and completely legitimate waste disposal services.',
	},
	{
		name: 'Drop Zone',
		description:
			'Efficient and reliable water delivery service ensuring residents have access to clean water when they need it most.',
	},
	{
		name: 'H2-Whoa Facility',
		description:
			' A high-tech facility known for its impressive and groundbreaking water processing solutions.',
	},
	{
		name: 'Bucket Brigade',
		description:
			'Reliable emergency water supply service ensuring access to water during critical situations.',
	},
	{
		name: 'Pump It Up Station',
		description:
			'A modern facility dedicated to high-efficiency water pumping and distribution to urban and rural areas.',
	},
];

faker.seed(123);

const facilities = facilityConst.map((facility) => {
	return {
		name: facility.name,
		assetId: faker.string.uuid(),
		description: facility.description,
		typeId: 'pump',
		indicatorMsg: 'Everything works fine',
	};
});

const CasesConst = [
	{
		title: 'Pump Repair Needed',
		description: 'The pump is damaged and is operating at a fraction of its original capacity',
		type: 'INCIDENT',
		priority: 'HIGH',
	},
	{
		title: 'Overflow Alarm',
		description: 'The overflow sensor is malfunctioning and causing false alarms',
		type: 'INCIDENT',
		priority: 'MEDIUM',
	},
	{
		title: 'Leak Detection',
		description: 'A significant leak has been detected in the main pipeline',
		type: 'INCIDENT',
		priority: 'EMERGENCY',
	},
	{
		title: 'Pressure Drop',
		description: 'Sudden pressure drop in the system is affecting water distribution',
		type: 'INCIDENT',
		priority: 'HIGH',
	},
	{
		title: 'Filter Replacement',
		description: 'The water filters are clogged and need immediate replacement',
		type: 'INCIDENT',
		priority: 'EMERGENCY',
	},
	{
		title: 'Valve Malfunction',
		description: 'A critical valve is stuck and preventing proper water flow',
		type: 'INCIDENT',
		priority: 'HIGH',
	},
	{
		title: 'Contamination Alert',
		description: 'Water tests have shown signs of contamination in the supply',
		type: 'INCIDENT',
		priority: 'HIGH',
	},
	{
		title: 'Pump Overheating',
		description: 'The pump is overheating due to continuous operation and insufficient cooling',
		type: 'INCIDENT',
		priority: 'MEDIUM',
	},
	{
		title: 'Sensor Calibration',
		description: 'Sensors need recalibration to ensure accurate readings',
		type: 'PLANNED',
		priority: 'LOW',
	},
	{
		title: 'Electrical Fault',
		description: 'An electrical fault has caused a shutdown of the main control panel',
		type: 'INCIDENT',
		priority: 'HIGH',
	},
	{
		title: 'Water Hammer Issue',
		description: 'Experiencing water hammer effect causing pipe vibrations and noise',
		type: 'INCIDENT',
		priority: 'MEDIUM',
	},
	{
		title: 'System Upgrade',
		description: 'The system requires an upgrade to handle increased water demand',
		type: 'ANNOTATION',
		priority: 'MEDIUM',
	},
	{
		title: 'Backup Generator Failure',
		description: 'The backup generator has failed and needs urgent repair',
		type: 'INCIDENT',
		priority: 'EMERGENCY',
	},
	{
		title: 'Water Quality Testing',
		description: 'Routine water quality testing has detected abnormal levels of contaminants',
		type: 'ANNOTATION',
		priority: 'MEDIUM',
	},
	{
		title: 'Flow Rate Anomaly',
		description: 'Unexplained fluctuations in water flow rate require investigation',
		type: 'ANNOTATION',
		priority: 'LOW',
	},
	{
		title: 'Pipe Burst',
		description: 'A major pipe has burst, causing significant water loss',
		type: 'INCIDENT',
		priority: 'EMERGENCY',
	},
	{
		title: 'Pump Station Power Outage',
		description: 'A power outage has halted operations at the pump station',
		type: 'INCIDENT',
		priority: 'HIGH',
	},
	{
		title: 'Tank Overflow',
		description: 'A storage tank is overflowing due to faulty level sensors',
		type: 'INCIDENT',
		priority: 'HIGH',
	},
	{
		title: 'Unauthorized Access',
		description: 'There has been unauthorized access to the control system',
		type: 'INCIDENT',
		priority: 'HIGH',
	},
	{
		title: 'Maintenance Schedule',
		description: 'Regular maintenance is due for several system components',
		type: 'PLANNED',
		priority: 'LOW',
	},
];

// still requires the assetId to be added
let cases = CasesConst.map((caseItem) => {
	return {
		handle: 'AA-' + faker.number.int({ min: 1000, max: 9999 }),
		dueDate: faker.date.soon({ days: 30 }),
		status: faker.helpers.arrayElement(['OPEN', 'OPEN', 'INPROGRESS', 'DONE', 'ARCHIVED']),
		assignedTo: faker.internet.email(),
		title: caseItem.title,
		description: caseItem.description,
		type: caseItem.type,
		source:
			faker.helpers.arrayElement(['Internal', 'External']) +
			' System ' +
			faker.number.int({ min: 1, max: 10 }),
		priority: caseItem.priority,
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
	const pumpData = index % 3 === 0 ? pump2pumpData : pump10pumpData;
	const envData = index % 3 === 0 ? pump2envData : pump10envData;

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

	// take 0-2 cases from the cases array and remove them
	const caseData = faker.helpers.arrayElements(cases, { min: 0, max: 3 });
	cases = cases.filter((item) => !caseData.includes(item));

	const newCaseData = caseData.map((data: any) => {
		return {
			handle: data.handle,
			dueDate: data.dueDate,
			title: data.title,
			type: data.type,
			status: data.status,
			assignedTo: data.assignedTo,
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
