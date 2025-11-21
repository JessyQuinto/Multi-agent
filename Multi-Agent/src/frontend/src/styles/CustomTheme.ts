import {
    createLightTheme,
    createDarkTheme,
    BrandVariants,
    Theme,
} from '@fluentui/react-components';

// Azure Professional Brand Colors
const azureBrand: BrandVariants = {
    10: '#E8F3FF',
    20: '#C7E0F4',
    30: '#A6CCEC',
    40: '#84B9E3',
    50: '#62A5DB',
    60: '#4192D2',
    70: '#1F7FCA',
    80: '#0F6CBD', // Primary brand color
    90: '#0C5AAD',
    100: '#094A9D',
    110: '#073A8D',
    120: '#042B7D',
    130: '#021C6D',
    140: '#000D5D',
    150: '#00044D',
    160: '#00003D',
};

// Create light theme with Azure Professional palette
export const azureLightTheme: Theme = createLightTheme(azureBrand);

// Create dark theme (optional, for future use)
export const azureDarkTheme: Theme = createDarkTheme(azureBrand);

// Override specific tokens for better control
azureLightTheme.colorBrandForeground1 = '#0F6CBD';
azureLightTheme.colorBrandForeground2 = '#0C5AAD';
azureLightTheme.colorNeutralForeground1 = '#242424';
azureLightTheme.colorNeutralForeground2 = '#605E5C';
azureLightTheme.colorNeutralBackground1 = '#FFFFFF';
azureLightTheme.colorNeutralBackground2 = '#F5F5F5';
azureLightTheme.colorNeutralBackground3 = '#EDEBE9';

// Status colors
azureLightTheme.colorPaletteGreenForeground1 = '#107C10';
azureLightTheme.colorPaletteRedForeground1 = '#D13438';
azureLightTheme.colorPaletteDarkOrangeForeground1 = '#F7630C';

export default azureLightTheme;
