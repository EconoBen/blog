type GrebePose = 'swim' | 'note' | 'peek' | 'think';
type GrebeFieldVariant = 'home' | 'book' | 'site';

interface GrebePlacement {
  pose: GrebePose;
  position: string;
  motion?: 'cross-a' | 'cross-b';
  mobile?: boolean;
}

const fields: Record<GrebeFieldVariant, GrebePlacement[]> = {
  home: [
    { pose: 'peek', position: 'grebe-position--home-1', mobile: true },
    { pose: 'swim', position: 'grebe-position--home-2', motion: 'cross-a', mobile: true },
    { pose: 'note', position: 'grebe-position--home-3', mobile: true },
    { pose: 'think', position: 'grebe-position--home-4' },
    { pose: 'swim', position: 'grebe-position--home-5', motion: 'cross-b' },
    { pose: 'peek', position: 'grebe-position--home-6', mobile: true },
    { pose: 'note', position: 'grebe-position--home-7' },
  ],
  book: [
    { pose: 'swim', position: 'grebe-position--book-1', mobile: true },
    { pose: 'peek', position: 'grebe-position--book-2' },
    { pose: 'note', position: 'grebe-position--book-3', mobile: true },
    { pose: 'swim', position: 'grebe-position--book-4', motion: 'cross-a', mobile: true },
    { pose: 'swim', position: 'grebe-position--book-5' },
    { pose: 'note', position: 'grebe-position--book-6', motion: 'cross-b' },
    { pose: 'peek', position: 'grebe-position--book-7', mobile: true },
    { pose: 'swim', position: 'grebe-position--book-8' },
  ],
  site: [
    { pose: 'swim', position: 'grebe-position--site-1', motion: 'cross-a', mobile: true },
    { pose: 'peek', position: 'grebe-position--site-2', mobile: true },
    { pose: 'note', position: 'grebe-position--site-3' },
    { pose: 'think', position: 'grebe-position--site-4', motion: 'cross-b' },
    { pose: 'swim', position: 'grebe-position--site-5', mobile: true },
    { pose: 'note', position: 'grebe-position--site-6' },
    { pose: 'peek', position: 'grebe-position--site-7' },
  ],
};

export function GrebeField({ variant }: { variant: GrebeFieldVariant }) {
  return (
    <div
      className={`grebe-field grebe-field--${variant} pointer-events-none`}
      aria-hidden="true"
    >
      {fields[variant].map((grebe, index) => (
        <span
          key={`${grebe.pose}-${index}`}
          className={[
            'grebe-mascot',
            `grebe-mascot--${grebe.pose}`,
            grebe.position,
            grebe.motion ? `grebe-motion--${grebe.motion}` : '',
            grebe.mobile ? 'grebe-mascot--mobile' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      ))}
    </div>
  );
}
