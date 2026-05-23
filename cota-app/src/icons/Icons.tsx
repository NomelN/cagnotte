import React from 'react';
import Svg, { Path, Circle, Rect, G, Ellipse } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Cota logo mark (rounded square + "c" loop)
export const CotaMark = ({ size = 64, color = '#1E9D5A' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Rect x="2" y="2" width="60" height="60" rx="18" fill={color} />
    <Path d="M44 22 a 14 14 0 1 0 0 20" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
    <Circle cx="44" cy="32" r="3" fill="#fff" />
  </Svg>
);

export const AppleIcon = ({ size = 20, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M16.4 12.4c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.6.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.2-1.5 2.7-.4 6.6 1.1 8.8.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7 1.3 0 1.7.7 2.8.7 1.2 0 1.9-1.1 2.6-2.1.8-1.2 1.1-2.3 1.2-2.4-.1 0-2.2-.9-2.2-3.6zM14.3 5.7c.6-.7 1-1.7.9-2.7-.8 0-1.9.5-2.5 1.2-.5.6-1 1.6-.9 2.6.9.1 1.8-.4 2.5-1.1z"
    />
  </Svg>
);

export const GoogleIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path fill="#4285F4" d="M22 12.2c0-.8-.1-1.4-.2-2H12v3.9h5.7c-.2 1.3-1 2.4-2.1 3.1v2.6h3.4c2-1.8 3-4.5 3-7.6z" />
    <Path fill="#34A853" d="M12 22c2.7 0 5-1 6.6-2.4l-3.4-2.6c-.9.6-2.1 1-3.2 1-2.5 0-4.6-1.7-5.3-4H3.2v2.5C4.8 19.8 8.2 22 12 22z" />
    <Path fill="#FBBC05" d="M6.7 13.9c-.2-.5-.3-1.1-.3-1.7s.1-1.2.3-1.7V8H3.2C2.5 9.3 2 10.6 2 12.2c0 1.6.4 3 1.2 4.3l3.5-2.6z" />
    <Path fill="#EA4335" d="M12 6c1.4 0 2.7.5 3.7 1.4l2.8-2.8C16.9 3.2 14.7 2 12 2 8.2 2 4.8 4.2 3.2 7.5L6.7 10c.7-2.3 2.8-4 5.3-4z" />
  </Svg>
);

export const FacebookIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path fill="#1877F2" d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12z"/>
    <Path fill="#fff" d="M16.671 15.469L17.203 12h-3.328v-2.251c0-.949.465-1.874 1.956-1.874h1.514V4.922s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669V12H7.078v3.469h3.047v8.385a12.09 12.09 0 003.75 0V15.47h2.796z"/>
  </Svg>
);

export const BellIcon = ({ size = 24, color = '#8E8E93' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M6 16h12l-1.5-2.2v-3.3a4.5 4.5 0 0 0-9 0v3.3L6 16Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
    <Path d="M10 19a2 2 0 0 0 4 0" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </Svg>
);

export const EyeIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z" stroke={color} strokeWidth="1.6"/>
    <Circle cx="12" cy="12" r="2.6" stroke={color} strokeWidth="1.6"/>
  </Svg>
);

export const ArrowRIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12h14M14 6l6 6-6 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const BackIcon = ({ size = 24, color = '#1C1C1E' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 6l-6 6 6 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const LockIcon = ({ size = 24, color = '#8E8E93' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="11" width="14" height="9" rx="2.2" stroke={color} strokeWidth="1.6"/>
    <Path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={color} strokeWidth="1.6"/>
  </Svg>
);

export const ShareIcon = ({ size = 24, color = '#1C1C1E' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 4v12M12 4l-4 4M12 4l4 4M5 14v5h14v-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const DotsIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="6" cy="12" r="1.6" fill={color}/>
    <Circle cx="12" cy="12" r="1.6" fill={color}/>
    <Circle cx="18" cy="12" r="1.6" fill={color}/>
  </Svg>
);

export const PlusIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

export const CheckIcon = ({ size = 24, color = '#1E9D5A' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12.5l4.5 4.5L20 6.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const CameraIcon = ({ size = 24, color = '#8E8E93' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 8h3l2-2h6l2 2h3v10H4z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
    <Circle cx="12" cy="13" r="3.4" stroke={color} strokeWidth="1.6"/>
  </Svg>
);

export const CalIcon = ({ size = 24, color = '#8E8E93' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="6" width="16" height="14" rx="2" stroke={color} strokeWidth="1.6"/>
    <Path d="M4 10h16M9 4v4M15 4v4" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </Svg>
);

export const ChevRIcon = ({ size = 24, color = '#C7C7CC' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M10 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const CopyIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="8" y="8" width="12" height="12" rx="2" stroke={color} strokeWidth="1.6"/>
    <Path d="M4 16V6a2 2 0 0 1 2-2h10" stroke={color} strokeWidth="1.6"/>
  </Svg>
);

export const QrIcon = ({ size = 24, color = '#FFFFFF' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7" height="7" stroke={color} strokeWidth="1.6"/>
    <Rect x="14" y="3" width="7" height="7" stroke={color} strokeWidth="1.6"/>
    <Rect x="3" y="14" width="7" height="7" stroke={color} strokeWidth="1.6"/>
    <Path d="M14 14h3v3M21 14v3M14 21h7M17 17v4" stroke={color} strokeWidth="1.6"/>
  </Svg>
);

export const LinkIcon = ({ size = 24, color = '#1C1C1E' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1M14 10a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
  </Svg>
);

export const ShieldIcon = ({ size = 24, color = '#1E9D5A' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3l8 3v6c0 4-3.5 7.5-8 9-4.5-1.5-8-5-8-9V6z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
    <Path d="M9 12l2.4 2.4L15.5 10" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Category icons
export const GiftIcon = ({ size = 24, color = '#8E8E93' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Rect x="5" y="12.5" width="22" height="14.5" rx="1.5" stroke={color} strokeWidth="1.6"/>
    <Path d="M4 12.5h24M16 12.5v14.5" stroke={color} strokeWidth="1.6"/>
    <Path d="M16 12.5c-1.5-4-5.5-5-7-2.5s.5 4 4 4M16 12.5c1.5-4 5.5-5 7-2.5s-.5 4-4 4" stroke={color} strokeWidth="1.6"/>
  </Svg>
);

export const PlaneIcon = ({ size = 24, color = '#8E8E93' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path d="M3 17l11-2.5L21 5l3 1.5-4.5 12.5 5.5 6-2.5 1.5-7.5-4-9 5z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
  </Svg>
);

export const BabyIcon = ({ size = 24, color = '#8E8E93' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx="16" cy="12.5" r="6.5" stroke={color} strokeWidth="1.6"/>
    <Circle cx="13.5" cy="12.5" r="0.9" fill={color}/>
    <Circle cx="18.5" cy="12.5" r="0.9" fill={color}/>
    <Path d="M13.5 15.5c.7 1 1.7 1.2 2.5 1.2s1.8-.2 2.5-1.2M5 27c1.5-4.5 6-6 11-6s9.5 1.5 11 6" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </Svg>
);

export const HeartIcon = ({ size = 24, color = '#8E8E93' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path d="M16 27s-10-6.2-10-14a5.5 5.5 0 0 1 10-3.5A5.5 5.5 0 0 1 26 13c0 7.8-10 14-10 14z" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
  </Svg>
);

export const HandIcon = ({ size = 24, color = '#8E8E93' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Path d="M10 16V8a2 2 0 1 1 4 0v8M14 16V6a2 2 0 1 1 4 0v10M18 16V8a2 2 0 1 1 4 0v10c0 4-3 8-7 8s-6.5-2-8-5l-2-5 2.5-1 2.5 3" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"/>
  </Svg>
);

export const MoreIcon = ({ size = 24, color = '#8E8E93' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx="9" cy="16" r="2" fill={color}/>
    <Circle cx="16" cy="16" r="2" fill={color}/>
    <Circle cx="23" cy="16" r="2" fill={color}/>
  </Svg>
);

// Profile icons
export const IdCardIcon = ({ size = 24, color = '#1E9D5A' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="5" width="18" height="14" rx="2.5" stroke={color} strokeWidth="1.6"/>
    <Circle cx="9" cy="11.5" r="2" stroke={color} strokeWidth="1.6"/>
    <Path d="M13.5 10.5h4M13.5 13.5h3M6 16.5c.5-1.5 1.8-2.2 3-2.2s2.5.7 3 2.2" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </Svg>
);

export const GearIcon = ({ size = 24, color = '#1E9D5A' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.6"/>
    <Path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </Svg>
);

export const HelpIcon = ({ size = 24, color = '#1E9D5A' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6"/>
    <Path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1.1 1-1.1 1.7v.5" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
    <Circle cx="12" cy="17" r="0.9" fill={color}/>
  </Svg>
);

export const LogoutIcon = ({ size = 24, color = '#FF3B30' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M14 6h-7v12h7M11 12h10M18 9l3 3-3 3" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

export const CardIcon = ({ size = 24, color = '#3C3C43' }: IconProps) => (
  <Svg width={34} height={22} viewBox="0 0 34 22" fill="none">
    <Rect x="0.7" y="0.7" width="32.6" height="20.6" rx="3.5" stroke={color} strokeWidth="1.2"/>
    <Circle cx="22" cy="11" r="5.4" fill="#EB001B" fillOpacity="0.85"/>
    <Circle cx="27.5" cy="11" r="5.4" fill="#F79E1B" fillOpacity="0.85"/>
  </Svg>
);

// Social icons
export const WhatsAppIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 2C6.48 2 2 6.48 2 12c0 1.95.56 3.77 1.53 5.31L2 22l4.83-1.5A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.4 14.18c-.23.65-1.13 1.19-1.85 1.34-.5.11-1.14.19-3.31-.71-2.78-1.15-4.57-3.97-4.7-4.16-.14-.18-1.13-1.5-1.13-2.87s.71-2.03.97-2.31c.26-.28.56-.35.75-.35h.54c.17 0 .4-.06.63.48.24.55.81 1.92.88 2.06.07.14.12.3.02.49-.1.18-.14.3-.28.46-.14.16-.3.36-.42.49-.14.14-.29.3-.12.59.17.28.74 1.22 1.6 1.99 1.09.98 2.02 1.28 2.3 1.43.29.14.46.12.62-.07.17-.2.71-.83.9-1.11.18-.28.37-.23.62-.14.25.09 1.62.76 1.9.9.27.14.46.21.53.33.06.12.06.71-.17 1.35z" fill="#25D366"/>
  </Svg>
);

export const SmsIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 3C6.7 3 2.5 6.7 2.5 11.3c0 2.4 1.2 4.6 3.2 6.1l-.9 3.3 3.5-1.7c1.2.4 2.4.6 3.7.6 5.3 0 9.5-3.7 9.5-8.3S17.3 3 12 3z" fill="#34C759"/>
  </Svg>
);

export const MailIcon = ({ size = 24 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="2.5" y="5.5" width="19" height="13" rx="2" fill="#FF9500"/>
    <Path d="M3 7l9 6 9-6" stroke="white" strokeWidth="1.5" fill="none"/>
  </Svg>
);

// Tab bar icons
export const HomeActiveIcon = ({ size = 26 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M3.6 11.5L12 4l8.4 7.5V20a1 1 0 0 1-1 1h-5v-6h-4.8v6h-5a1 1 0 0 1-1-1z" fill="#1E9D5A"/>
  </Svg>
);

export const HomeInactiveIcon = ({ size = 26 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3.6 11.5L12 4l8.4 7.5V20a1 1 0 0 1-1 1h-5v-6h-4.8v6h-5a1 1 0 0 1-1-1z" stroke="#8E8E93" strokeWidth="1.7" strokeLinejoin="round"/>
  </Svg>
);

export const PotsActiveIcon = ({ size = 26 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="3.5" y="9" width="17" height="11.5" rx="2.5" fill="#1E9D5A"/>
    <Path d="M7 9V7.5A2 2 0 0 1 9 5.5h6a2 2 0 0 1 2 2V9" stroke="#1E9D5A" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
  </Svg>
);

export const PotsInactiveIcon = ({ size = 26 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3.5" y="9" width="17" height="11.5" rx="2.5" stroke="#8E8E93" strokeWidth="1.7"/>
    <Path d="M7 9V7.5A2 2 0 0 1 9 5.5h6a2 2 0 0 1 2 2V9" stroke="#8E8E93" strokeWidth="1.7" strokeLinecap="round"/>
  </Svg>
);

export const PayActiveIcon = ({ size = 26 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x="3" y="6" width="18" height="13" rx="2.5" fill="#1E9D5A"/>
    <Path d="M3 10.5h18" stroke="white" strokeWidth="1.7"/>
  </Svg>
);

export const PayInactiveIcon = ({ size = 26 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="6" width="18" height="13" rx="2.5" stroke="#8E8E93" strokeWidth="1.7"/>
    <Path d="M3 10.5h18M6.5 15h4" stroke="#8E8E93" strokeWidth="1.7" strokeLinecap="round"/>
  </Svg>
);

export const BellTabActiveIcon = ({ size = 26 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M12 3a5.5 5.5 0 0 0-5.5 5.5v4L5 15.5a1 1 0 0 0 .87 1.5h12.26a1 1 0 0 0 .87-1.5L17.5 12.5v-4A5.5 5.5 0 0 0 12 3z" fill="#1E9D5A"/>
    <Path d="M9.8 18.5a2.2 2.2 0 0 0 4.4 0" stroke="#1E9D5A" strokeWidth="1.7" strokeLinecap="round"/>
  </Svg>
);

export const BellTabInactiveIcon = ({ size = 26 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3a5.5 5.5 0 0 0-5.5 5.5v4L5 15.5a1 1 0 0 0 .87 1.5h12.26a1 1 0 0 0 .87-1.5L17.5 12.5v-4A5.5 5.5 0 0 0 12 3z" stroke="#8E8E93" strokeWidth="1.7" strokeLinejoin="round"/>
    <Path d="M9.8 18.5a2.2 2.2 0 0 0 4.4 0" stroke="#8E8E93" strokeWidth="1.7" strokeLinecap="round"/>
  </Svg>
);

export const UserActiveIcon = ({ size = 26 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx="12" cy="9" r="4" fill="#1E9D5A"/>
    <Path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" fill="#1E9D5A"/>
  </Svg>
);

export const UserInactiveIcon = ({ size = 26 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="9" r="4" stroke="#8E8E93" strokeWidth="1.7"/>
    <Path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" stroke="#8E8E93" strokeWidth="1.7" strokeLinecap="round"/>
  </Svg>
);

export const KeyIcon = ({ size = 24, color = '#1E9D5A' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="8.5" cy="12" r="4.5" stroke={color} strokeWidth="1.7"/>
    <Path d="M13 12h7.5M17.5 10v4" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
  </Svg>
);

export const EditIcon = ({ size = 24, color = T.ink2 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 20h4l10.5-10.5a2.83 2.83 0 0 0-4-4L4 16v4z" stroke={color} strokeWidth="1.7" strokeLinejoin="round"/>
    <Path d="M14.5 5.5l4 4" stroke={color} strokeWidth="1.7" strokeLinecap="round"/>
  </Svg>
);
