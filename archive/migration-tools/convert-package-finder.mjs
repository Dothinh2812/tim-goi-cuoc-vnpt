import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();

const packageTypes = `export type BillingDuration = 'm1' | 'm6' | 'm12';
export type CoverageArea = 'urban' | 'suburb';

export interface PriceByDuration {
  m1: number;
  m6: number;
  m12: number;
}

export interface PackageCategory {
  label: string;
  icon: string;
  color: string;
}

export interface PackageDefinition {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  speed: number;
  speedLabel: string;
  hasMesh: boolean;
  meshDevice?: string;
  hasTV: boolean;
  hasCamera: boolean;
  hasMobile: boolean;
  hasStaticIP: boolean;
  security?: string;
  components?: string;
  price: Record<CoverageArea, PriceByDuration>;
  tags: string[];
  badge?: string | null;
  popular?: boolean;
  tvPlan?: string;
  mobileData?: string;
  maxMembers?: number;
  cameraCount?: number;
  cloudDays?: number;
}
`;

const dataSource = await fs.readFile(path.join(rootDir, 'data.js'), 'utf8');
const appSource = await fs.readFile(path.join(rootDir, 'app.js'), 'utf8');

const packagesOutput = `${packageTypes}
${dataSource
  .replace(/const PACKAGES\s*=\s*/u, 'export const PACKAGES: PackageDefinition[] = ')
  .replace(/const CATEGORIES\s*=\s*/u, 'export const CATEGORIES: Record<string, PackageCategory> = ')}`;

const packageFinderOutput = `import { CATEGORIES, PACKAGES } from '../data/packages';

${appSource.replace(/\/\*\s*global PACKAGES,\s*CATEGORIES\s*\*\/\s*/u, '')}`;

await fs.mkdir(path.join(rootDir, 'src', 'data'), { recursive: true });
await fs.writeFile(path.join(rootDir, 'src', 'data', 'packages.ts'), packagesOutput);
await fs.writeFile(path.join(rootDir, 'src', 'scripts', 'package-finder.ts'), packageFinderOutput);
