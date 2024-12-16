import Head from "next/head";
import { useEffect } from "react";
import {
  useForm,
  useWatch,
  type Control,
  type UseFormRegister,
} from "react-hook-form";

type FormValues = {
  minutesWorked: number;
  minutesGoal: number;
  workoutsPerWeek: number;
  weeksSkipped: number;
};

const weeksRemainingInYear = (date: Date) =>
  Math.floor(
    (new Date() - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
  );

const MinutesPerWorkout = ({
  control,
}: {
  control: Control<FormValues, any>;
}) => {
  const minutesWorked = useWatch({
    control,
    name: "minutesWorked",
  });
  const workoutsPerWeek = useWatch({
    control,
    name: "workoutsPerWeek",
  });
  const minutesGoal = useWatch({
    control,
    name: "minutesGoal",
  });
  const weeksSkipped = useWatch({
    control,
    name: "weeksSkipped",
  });
  const d1 = new Date();
  const d2 = new Date(d1.getFullYear(), 11, 31);
  const weeksRemaining = Math.floor(
    (d2.getTime() - d1.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  const minutesRemaining = minutesGoal - minutesWorked;
  const minutesPerWeek = Math.ceil(
    minutesRemaining / (weeksRemaining - weeksSkipped)
  );
  const minutesPerWorkout = Math.ceil(minutesPerWeek / workoutsPerWeek);

  return (
    <div className="col-span-2">
      <p className="text-center text-2xl text-slate-50">
        Minutes per workout: {minutesPerWorkout}
      </p>
      <p className="text-center text-2xl text-slate-50">
        Workouts per week: {workoutsPerWeek}
      </p>
      <p className="text-center text-2xl text-slate-500">
        Weeks remaining: {weeksRemaining}
      </p>
    </div>
  );
};

const NumberInput = ({
  label,
  name,
  register,
  min = 0,
}: {
  label: string;
  name: keyof FormValues;
  register: UseFormRegister<FormValues>;
  min?: number;
}) => (
  <label
    htmlFor={name}
    className="flex w-full flex-col gap-2 text-xl font-semibold text-slate-50"
  >
    <span>{label}</span>
    <input
      {...register(name)}
      className="rounded-lg border border-slate-300 bg-slate-900 px-4 py-3 font-semibold text-slate-50 no-underline transition hover:bg-slate-800"
      type="number"
      placeholder={label}
      min={min}
    />
  </label>
);

export default function Home() {
  const { register, control } = useForm<FormValues>({
    defaultValues: {
      minutesWorked: 0,
      minutesGoal: 6000,
      workoutsPerWeek: 3,
      weeksSkipped: 0,
    },
  });

  useEffect(() => {
    const getData = async () => {
      // step 1: authenticate with Peloton
      const body = {
        username_or_email: process.env.PELOTON_USERNAME,
        password: process.env.PELOTON_PASSWORD,
      };

      // const response = await fetch("https://api.onepeloton.com/auth/login", {
      //   method: "post",
      //   body: JSON.stringify(body),
      //   headers: { "Content-Type": "application/json" },
      //   mode: "same-origin",
      // });
      // const authData = await response.json();

      const authData = {
        session_id: "d93f074345f04414ace9fd7cdf40f979",
        user_id: "c07c7efb6c2f42eaa9a3eea0c09f4fc3",
      };

      const opts = {
        headers: {
          cookie: `peloton_session_id=${authData.session_id};`,
          "peloton-platform": "web",
        },
      };

      // Step 2: retrieve workout data from the overview
      const responseOverview = await fetch(
        `https://api.onepeloton.com.au/api/user/${authData.user_id}/overview`,
        opts
      );
    };

    void getData();
  }, []);

  return (
    <>
      <Head>
        <title>Workouts per Week Calculator</title>
        <meta
          name="description"
          content="Get specific with your workout goals"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-50 sm:text-[5rem]">
            Minutes calculator
          </h1>
          <div className="flex flex-col items-center gap-4 md:gap-8">
            <NumberInput
              label="Minutes worked out this year"
              name="minutesWorked"
              register={register}
            />
            <NumberInput
              label="Minutes goal for the year"
              name="minutesGoal"
              register={register}
            />
            <NumberInput
              label="Goal workouts per week"
              name="workoutsPerWeek"
              register={register}
            />
            <NumberInput
              label="Number of weeks you may miss"
              name="weeksSkipped"
              register={register}
            />
            <MinutesPerWorkout control={control} />
          </div>
        </div>
      </main>
    </>
  );
}
