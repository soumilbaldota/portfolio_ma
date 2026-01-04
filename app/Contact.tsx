import { CalendarDays, Linkedin, Mail, MessageCircle, Phone, type LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { useAccentColor } from './AccentColorContext';

type ContactMethod = {
    label: string;
    Icon: LucideIcon;
    link?: string;
};

const CONTACT_METHODS: ContactMethod[] = [
    { label: 'email', Icon: Mail, link: 'mailto:ssb2234@columbia.edu' },
    { label: 'schedule', Icon: CalendarDays, link: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2ja62H_eo2qU6_blBj5v2elCGFaQvYaJiD-JZZVbBYfZrskFWBECqqj6KcL7iokPUZsLx7_BlG?gv=true' },
    { label: 'call', Icon: Phone, link: 'tel:+16463268135' },
    { label: 'text', Icon: MessageCircle, link: 'sms:+16463268135' },
    { label: 'linkedin', Icon: Linkedin, link: 'https://linkedin.com/in/soumilbaldota/' },
];


function ProfileAvatar({ className }: { className?: string }) {
    const avatarClassNames = ['rounded-full overflow-hidden', className || 'w-10 h-10 m-2'].join(' ');

    return (
        <div className={avatarClassNames}>
            <Image
                src="/soumil.png"
                alt="Soumil Pic"
                width={70}
                height={70}
                className="w-full h-full object-cover"
            />
        </div>
    );
}

function SidebarProfile() {
    const { accentColor } = useAccentColor();
    return (
        <div className="bg-surface-primary/20 backdrop-blur-2xl flex justify-center">
            <div 
                className="h-15 w-12/12 bg-surface-primary/80 rounded-sm flex items-center transition-colors"
                style={{
                    '--hover-bg': accentColor
                } as React.CSSProperties}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = accentColor}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
            >
                <ProfileAvatar />
                <div className="font-mono">Soumil Baldota</div>
            </div>
        </div>
    );
}

function HeaderProfile() {
    return (
        <div id="avatar-contacts" className="h-30 w-full flex justify-center items-center">
            <ProfileAvatar className="w-20 h-20 m-5" />
            <div className="font-mono h-20 m-5 flex items-center">Soumil Baldota</div>
        </div>
    );
}

function ContactAction({ Icon, label, link }: ContactMethod) {
    const { accentColor } = useAccentColor();
    return (
        <div className="flex flex-col items-center justify-center m-2.5">
            <div className="w-full flex justify-center cursor-pointer">
                <div 
                    className="w-10 h-10 rounded-full m-2 flex items-center justify-center" 
                    style={{ backgroundColor: accentColor }}
                    onClick={()=>{
                        if (link) window.open(link, '_blank');
                    }}
                >
                    <Icon className="text-white" />
                </div>
            </div>
            <div className="font-mono text-center">{label}</div>
        </div>
    );
}

export function Contacts() {
    return (
        <div className="w-full h-full">
            <div className="bg-divider w-full h-px" />

            <div className="grid grid-cols-[1fr_3fr] h-full w-full">
                <SidebarProfile />

                <div id="right-section" className="bg-surface-primary/90 w-full h-full flex items-start">
                    <div id="line" className="bg-divider h-full w-px" />

                    <div className="w-full h-full flex flex-col items-center justify-center">
                        <HeaderProfile />

                        <div className="flex justify-center w-full">
                            {CONTACT_METHODS.map((method) => (
                                <ContactAction key={method.label} {...method} />
                            ))}
                        </div>
                        <div id='details-section' className='flex flex-col w-full items-center justify-center'>
                            <div className='bg-divider w-4/5 h-px mb-2'></div>
                            <div className='grid grid-cols-1 '>
                                    <div className='flex flex-start'>
                                        <span className='font-mono mr-5'>Email</span>
                                        <span className='font-mono'>ssb2234@columbia.edu</span>
                                    </div>
                                    <div className='flex flex-start'>
                                        <span className='font-mono mr-5'>Phone</span>
                                        <span className='font-mono'>+16463268135</span>
                                    </div>
                            </div>
                        </div>
                    </div>


                </div>


            </div>
        </div>
    );
}