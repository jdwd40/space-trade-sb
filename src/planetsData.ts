// planetsData.ts
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
      foodProcessing: {
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
      AgriculturalAlliance: 70,
      EcoMovement: 30
    },
    hqPresent: false,
    strategicValue: 60,
    tradeRoutes: ["Ironforge", "Terra Prime"],
    coordinates: {
      x: 300,
      y: 450
    },
    image: "https://images.unsplash.com/photo-1628872354761-c289e266bbaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
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
      techFactory: {
        level: 4,
        capacity: 700
      },
      shipyard: {
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
      TechGuild: 60,
      IndustrialConsortium: 40
    },
    hqPresent: true,
    strategicValue: 95,
    tradeRoutes: ["Ironforge", "New Horizon"],
    coordinates: {
      x: 500,
      y: 300
    },
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80"
  }
];
