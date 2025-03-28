import React from 'react';

interface CountryFlagBadgeProps {
    code: string;
    className?: string;
    showTooltip?: boolean;
}

interface CountryFlagInfo {
    emoji: string;
    name: string;
    language: string;
    region?: string;
}

const COUNTRY_FLAGS: Record<string, CountryFlagInfo> = {
    'en': {
        emoji: '🇺🇸',
        name: 'United States',
        language: 'English',
        region: 'North America'
    },
    'gb': {
        emoji: '🇬🇧',
        name: 'United Kingdom',
        language: 'English',
        region: 'Europe'
    },
    'it': {
        emoji: '🇮🇹',
        name: 'Italy',
        language: 'Italian',
        region: 'Europe'
    },
    'fr': {
        emoji: '🇫🇷',
        name: 'France',
        language: 'French',
        region: 'Europe'
    },
    'es': {
        emoji: '🇪🇸',
        name: 'Spain',
        language: 'Spanish',
        region: 'Europe'
    },
    'de': {
        emoji: '🇩🇪',
        name: 'Germany',
        language: 'German',
        region: 'Europe'
    },
    'ja': {
        emoji: '🇯🇵',
        name: 'Japan',
        language: 'Japanese',
        region: 'Asia'
    },
    'ko': {
        emoji: '🇰🇷',
        name: 'South Korea',
        language: 'Korean',
        region: 'Asia'
    },
    'cn': {
        emoji: '🇨🇳',
        name: 'China',
        language: 'Chinese',
        region: 'Asia'
    },
    'zh': {
        emoji: '🇨🇳',
        name: 'China',
        language: 'Chinese',
        region: 'Asia'
    },
    'ru': {
        emoji: '🇷🇺',
        name: 'Russia',
        language: 'Russian',
        region: 'Europe/Asia'
    },
    'pt': {
        emoji: '🇵🇹',
        name: 'Portugal',
        language: 'Portuguese',
        region: 'Europe'
    },
    'br': {
        emoji: '🇧🇷',
        name: 'Brazil',
        language: 'Portuguese',
        region: 'South America'
    },
    'nl': {
        emoji: '🇳🇱',
        name: 'Netherlands',
        language: 'Dutch',
        region: 'Europe'
    },
    'tr': {
        emoji: '🇹🇷',
        name: 'Turkey',
        language: 'Turkish',
        region: 'Europe/Asia'
    },
    'pl': {
        emoji: '🇵🇱',
        name: 'Poland',
        language: 'Polish',
        region: 'Europe'
    },
    'hu': {
        emoji: '🇭🇺',
        name: 'Hungary',
        language: 'Hungarian',
        region: 'Europe'
    },
    'ro': {
        emoji: '🇷🇴',
        name: 'Romania',
        language: 'Romanian',
        region: 'Europe'
    },
    'sv': {
        emoji: '🇸🇪',
        name: 'Sweden',
        language: 'Swedish',
        region: 'Europe'
    },
    'da': {
        emoji: '🇩🇰',
        name: 'Denmark',
        language: 'Danish',
        region: 'Europe'
    },
    'fi': {
        emoji: '🇫🇮',
        name: 'Finland',
        language: 'Finnish',
        region: 'Europe'
    },
    'no': {
        emoji: '🇳🇴',
        name: 'Norway',
        language: 'Norwegian',
        region: 'Europe'
    },
    'cs': {
        emoji: '🇨🇿',
        name: 'Czech Republic',
        language: 'Czech',
        region: 'Europe'
    },
    'sk': {
        emoji: '🇸🇰',
        name: 'Slovakia',
        language: 'Slovak',
        region: 'Europe'
    },
    'el': {
        emoji: '🇬🇷',
        name: 'Greece',
        language: 'Greek',
        region: 'Europe'
    },
    'bg': {
        emoji: '🇧🇬',
        name: 'Bulgaria',
        language: 'Bulgarian',
        region: 'Europe'
    },
    'he': {
        emoji: '🇮🇱',
        name: 'Israel',
        language: 'Hebrew',
        region: 'Middle East'
    },
    'ar': {
        emoji: '🇸🇦',
        name: 'Saudi Arabia',
        language: 'Arabic',
        region: 'Middle East'
    },
    'hi': {
        emoji: '🇮🇳',
        name: 'India',
        language: 'Hindi',
        region: 'Asia'
    },
    'th': {
        emoji: '🇹🇭',
        name: 'Thailand',
        language: 'Thai',
        region: 'Asia'
    }
};

export const CountryFlagBadge: React.FC<CountryFlagBadgeProps> = ({
                                                                      code,
                                                                      className = '',
                                                                      showTooltip = true
                                                                  }) => {
    // Normalize the code to lowercase
    const normalizedCode = code.toLowerCase();
    
    // Find the flag info, use fallback object if not found
    const flagInfo = COUNTRY_FLAGS[normalizedCode] ?? {
        emoji: '🌐',
        name: 'Unknown',
        language: 'Unknown',
        region: 'Unknown'
    };
    
    // Tooltip content
    const tooltipContent = showTooltip
        ? `${ flagInfo.name } (${ flagInfo.language } - ${ flagInfo.region })`
        : '';
    
    return (
        <span
            className={ `inline-flex items-center rounded-full ${ className }` }
            title={ tooltipContent }
        >
            { flagInfo.emoji } { flagInfo.name }
        </span>
    );
};

export default CountryFlagBadge;