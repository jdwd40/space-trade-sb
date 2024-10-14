// planetsData.ts
import newHorizonImage from './img/new_horizon.jpg';
import terraPrimeImage from './img/terra_prime.jpg';
import cryosImage from './img/cryos.jpg';
import veridianImage from './img/veridain.jpg';
import zyntharImage from './img/zynthar.jpg';

export interface Planet {
  name: string;
  type: string;
  population: number;
  size: string;
  description: string;
  resources: {
    metals: number;
    gas: number;
    food: number;
  };
  productionCapacity: number;
  factories: Record<string, { level: number; capacity: number }>;
  armySize: number;
  armyEquipmentLevel: number;
  orbitalDefense: boolean;
  controlledBy: string;
  influenceLevel: number;
  factions: Record<string, number>;
  hqPresent: boolean;
  strategicValue: number;
  tradeRoutes: string[];
  coordinates: {
    x: number;
    y: number;
  };
  image: string;
}

export const planetsData: Planet[] = [
  {
    name: "New Horizon",
    type: "agricultural",
    population: 1200000,
    size: "medium",
    description: "A fertile planet, primarily known for its abundant food production and exports.",
    resources: {
      metals: 500,
      gas: 200,
      food: 20000
    },
    productionCapacity: 250,
    factories: {
      "foodProcessing": {
        level: 3,
        capacity: 500
      }
    },
    armySize: 8000,
    armyEquipmentLevel: 2,
    orbitalDefense: false,
    controlledBy: "neutral",
    influenceLevel: 20,
    factions: {
      "AgriculturalAlliance": 70,
      "EcoMovement": 30
    },
    hqPresent: false,
    strategicValue: 60,
    tradeRoutes: ["Ironforge", "Terra Prime"],
    coordinates: {
      x: 300,
      y: 450
    },
    image: newHorizonImage
  },
  {
    name: "Terra Prime",
    type: "technological",
    population: 9000000,
    size: "large",
    description: "The leading hub of technological research and development in the galaxy.",
    resources: {
      metals: 1000,
      gas: 500,
      food: 7000
    },
    productionCapacity: 600,
    factories: {
      "techFactory": {
        level: 4,
        capacity: 700
      },
      "shipyard": {
        level: 3,
        capacity: 200
      }
    },
    armySize: 15000,
    armyEquipmentLevel: 4,
    orbitalDefense: true,
    controlledBy: "AI_faction_2",
    influenceLevel: 85,
    factions: {
      "TechGuild": 60,
      "IndustrialConsortium": 40
    },
    hqPresent: true,
    strategicValue: 95,
    tradeRoutes: ["Ironforge", "New Horizon"],
    coordinates: {
      x: 500,
      y: 300
    },
    image: terraPrimeImage
  },
  {
    name: "Cryos",
    type: "resource-rich",
    population: 300000,
    size: "small",
    description: "An icy world with vast deposits of rare metals and gases, but its harsh environment limits habitation.",
    resources: {
      metals: 15000,
      gas: 8000,
      food: 500
    },
    productionCapacity: 100,
    factories: {
      "miningFacility": {
        level: 2,
        capacity: 300
      }
    },
    armySize: 2000,
    armyEquipmentLevel: 3,
    orbitalDefense: false,
    controlledBy: "neutral",
    influenceLevel: 10,
    factions: {
      "Miner'sGuild": 90
    },
    hqPresent: false,
    strategicValue: 85,
    tradeRoutes: ["Terra Prime"],
    coordinates: {
      x: 650,
      y: 400
    },
    image: cryosImage
  },
  {
    name: "Veridian",
    type: "eco-friendly",
    population: 2000000,
    size: "medium",
    description: "A lush, green planet focused on sustainability and eco-friendly production, with limited industrial activities.",
    resources: {
      metals: 2000,
      gas: 1000,
      food: 15000
    },
    productionCapacity: 150,
    factories: {
      "ecoFarm": {
        level: 3,
        capacity: 400
      }
    },
    armySize: 4000,
    armyEquipmentLevel: 2,
    orbitalDefense: true,
    controlledBy: "neutral",
    influenceLevel: 35,
    factions: {
      "EcoMovement": 80,
      "AgriculturalAlliance": 20
    },
    hqPresent: false,
    strategicValue: 50,
    tradeRoutes: ["New Horizon", "Cryos"],
    coordinates: {
      x: 200,
      y: 600
    },
    image: veridianImage
  },
  {
    name: "Zynthar",
    type: "militaristic",
    population: 7000000,
    size: "large",
    description: "A planet dominated by its military-industrial complex, known for producing some of the galaxy's most advanced weapons and ships.",
    resources: {
      metals: 7000,
      gas: 3000,
      food: 4000
    },
    productionCapacity: 500,
    factories: {
      "weaponsFactory": {
        level: 5,
        capacity: 800
      },
      "shipyard": {
        level: 4,
        capacity: 300
      }
    },
    armySize: 25000,
    armyEquipmentLevel: 5,
    orbitalDefense: true,
    controlledBy: "AI_faction_3",
    influenceLevel: 90,
    factions: {
      "WarriorClan": 70,
      "TechGuild": 30
    },
    hqPresent: true,
    strategicValue: 100,
    tradeRoutes: ["Ironforge", "Terra Prime"],
    coordinates: {
      x: 800,
      y: 200
    },
    image: zyntharImage
  }
];
