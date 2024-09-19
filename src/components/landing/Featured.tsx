import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
const features = [
  {
    name: 'Make Friends',
    description: 'Find people with similar interests and hobbies',
    icon: Groups2OutlinedIcon,
  },
  {
    name: 'Dating',
    description:
      'Have precice control over who you match and send messages too',
    icon: FavoriteBorderOutlinedIcon,
  },
  {
    name: 'Events',
    description:
      'Search events that interest you, say you will be attending, and find people to go with',
    icon: CalendarMonthOutlinedIcon,
  },
  {
    name: 'Hookups',
    description:
      "We aren't just a simple dating platform, tailor your experience to find precicesly what and who you are looking for",
    icon: LocalFireDepartmentOutlinedIcon,
  },
];

export default function Featured() {
  return (
    <div className="py-6 sm:py-20">
      <div className="mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="font-semibold leading-7 text-red-600">
            Match Faster
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to make quality connections
          </p>
          <p className="mt-6 text-lg leading-8 ">
            We have it all! Below you will find some of our amazing
            features. Make connections, make friends, find events, see
            people nearby and much, much more.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 ">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
                    <feature.icon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 ">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
