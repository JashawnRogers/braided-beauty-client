"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  modifiersClassNames,
  showOutsideDays = true,
  components: userComponents,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = {
    months: "relative flex flex-col sm:flex-row gap-4",
    month: "w-full",
    month_caption:
      "relative mx-10 mb-1 flex h-9 items-center justify-center z-20",
    caption_label: "text-sm font-medium",
    nav: "absolute top-0 flex w-full justify-between z-10",
    button_previous: cn(
      buttonVariants({ variant: "ghost" }),
      "size-9 text-muted-foreground/80 hover:text-foreground p-0"
    ),
    button_next: cn(
      buttonVariants({ variant: "ghost" }),
      "size-9 text-muted-foreground/80 hover:text-foreground p-0"
    ),
    weekday: "size-9 p-0 text-xs font-medium text-muted-foreground/80",
    day_button:
      "relative flex size-9 items-center justify-center whitespace-nowrap rounded-md p-0 text-foreground " +
      "hover:bg-accent hover:text-foreground " +
      "aria-selected:bg-primary aria-selected:text-primary-foreground " +
      "data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground " +
      "outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] " +
      "group-data-disabled:pointer-events-none group-data-disabled:text-foreground/30 group-data-disabled:line-through " +
      "group-data-outside:text-foreground/30",
    day: "group size-9 px-0 py-px text-sm",

    range_start: "range-start",
    range_end: "range-end",
    range_middle: "range-middle",
    today:
      "*:after:pointer-events-none *:after:absolute *:after:bottom-1 *:after:start-1/2 *:after:z-10 *:after:size-[3px] *:after:-translate-x-1/2 *:after:rounded-full *:after:bg-primary [&[data-selected]:not(.range-middle)>*]:after:bg-background [&[data-disabled]>*]:after:bg-foreground/30 *:after:transition-colors",
    outside:
      "text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground data-[selected=true]:bg-accent/50 data-[selected=true]:text-muted-foreground",
    hidden: "invisible",
    week_number: "size-9 p-0 text-xs font-medium text-muted-foreground/80",
  };

  const mergedClassNames: typeof defaultClassNames = Object.keys(
    defaultClassNames
  ).reduce(
    (acc, key) => ({
      ...acc,
      [key]: classNames?.[key as keyof typeof classNames]
        ? cn(
            defaultClassNames[key as keyof typeof defaultClassNames],
            classNames[key as keyof typeof classNames]
          )
        : defaultClassNames[key as keyof typeof defaultClassNames],
    }),
    {} as typeof defaultClassNames
  );

  const defaultComponents = {
    Chevron: (props: {
      className?: string;
      size?: number;
      disabled?: boolean;
      orientation?: "left" | "right" | "up" | "down";
    }) => {
      if (props.orientation === "left") {
        return <ChevronLeftIcon size={16} {...props} aria-hidden="true" />;
      }
      return <ChevronRightIcon size={16} {...props} aria-hidden="true" />;
    },
  };

  const mergedComponents = {
    ...defaultComponents,
    ...userComponents,
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("w-fit", className)}
      classNames={mergedClassNames}
      modifiersClassNames={{
        selected: "[&>button]:bg-primary [&>button]:text-primary-foreground",
        ...modifiersClassNames,
      }}
      components={mergedComponents}
      {...props}
    />
  );
}

export { Calendar };
