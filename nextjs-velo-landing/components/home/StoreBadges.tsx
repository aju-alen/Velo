import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/app-links';

const badgeLink =
  'inline-flex rounded-xl transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#11181C] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FFAC1C]';

const badgeImage = 'h-auto w-64 sm:w-72';

export default function StoreBadges() {
  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-3 lg:w-auto">
      <a href={APP_STORE_URL} className={badgeLink}>
        <img
          src="/download_coach_apple.svg"
          alt="Download on the App Store"
          width={121}
          height={40}
          className={badgeImage}
        />
      </a>
      <a href={PLAY_STORE_URL} className={badgeLink}>
        <img
          src="/download_coach_android.svg"
          alt="Get it on Google Play"
          width={139}
          height={40}
          className={badgeImage}
        />
      </a>
    </div>
  );
}
