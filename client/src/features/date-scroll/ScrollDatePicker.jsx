import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollMenu,
  VisibilityContext,
  getItemsPos,
} from 'react-horizontal-scrolling-menu';
import useDrag from './useDrag';
import { CalendarComponent } from 'features/date-scroll/Calendar';
import { generateCalendarState } from './generateCalendarState';

export const ScrollDatePicker = ({
  selectedDate,
  setSelectedDate,
  items,
  setItems,
  selected,
  setSelected,
  data,
  isError,
  isLoading,
}) => {
  const { dragStart, dragStop, dragMove, dragging } = useDrag();
  const [hasMounted, setHasMounted] = useState(false);
  const apiRef = useRef();

  const reset = () => {
    const filteredItem = items.filter(
      (item) =>
        item.month === new Date().getMonth() + 1 &&
        item.year === new Date().getFullYear() &&
        item.day === new Date().getDate()
    );

    if (!filteredItem.length) {
      const newDates = generateCalendarState(new Date());
      setItems(newDates);
      return;
    }

    const currentId = items.filter(
      (item) =>
        item.day === new Date().getDate() &&
        item.month === new Date().getMonth() + 1
    )[0].id;

    apiRef?.current?.scrollToItem(
      apiRef?.current?.getItemElementById(currentId),
      'smooth',
      'center'
    );

    setSelected(
      items.filter(
        (item) =>
          item.day === new Date().getDate() &&
          item.month === new Date().getMonth() + 1
      )[0]
    );
  };

  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
      reset();
    }
  }, []);

  const handleDrag =
    ({ scrollContainer }) =>
    (ev) =>
      dragMove(ev, (posDiff) => {
        if (scrollContainer.current) {
          scrollContainer.current.scrollLeft += posDiff;
        }
      });

  const handleItemClick =
    (itemId) =>
    ({ getItemById, scrollToItem }) => {
      if (dragging) {
        return false;
      }
      setSelected(items.filter((item) => item.id === itemId)[0]);
      scrollToItem(getItemById(itemId), 'smooth', 'center', 'nearest');
    };

  return (
    <div className="pt-5">
      <div className="flex justify-between">
        <CalendarComponent
          setItems={setItems}
          scrollToItem={(itemId) => {
            return apiRef.current.scrollToItem(
              apiRef.current.getItemElementById(itemId),
              'smooth',
              'center'
            );
          }}
          items={items}
          setSelectedDate={setSelectedDate}
          setSelected={setSelected}
          displayDate={new Intl.DateTimeFormat('en-CA', {
            month: 'short',
            day: 'numeric',
            weekday: 'short',
            year: 'numeric',
          }).format(
            selected.id
              ? new Date(selected.year, selected.month - 1, selected.day)
              : new Date()
          )}
        />
        <button
          className="bg-white px-3 py-1 rounded-md text-xs"
          onClick={reset}
        >
          {items.filter(
            (item) =>
              item.month === new Date().getMonth() + 1 &&
              item.year === new Date().getFullYear() &&
              item.day === new Date().getDate()
          ).length
            ? 'Today'
            : 'Reset'}
        </button>
      </div>

      <ul className="p-2" onMouseLeave={dragStop}>
        <ScrollMenu
          apiRef={apiRef}
          onMouseDown={() => dragStart}
          onMouseUp={({ getItemById, scrollToItem, visibleItems }) =>
            () => {
              dragStop();
              const { center } = getItemsPos(visibleItems);
              scrollToItem(getItemById(center), 'smooth', 'center');
            }}
          options={{ throttle: 0 }}
          onMouseMove={handleDrag}
        >
          {items.map((state, key) => {
            return (
              <ButtonDate
                state={state}
                onClick={handleItemClick(state.id)}
                itemId={state.id}
                key={key}
                selected={state.id === selected.id}
                highlight={handleHighlight(state, data)}
              />
            );
          })}
        </ScrollMenu>
      </ul>
    </div>
  );
};

const ButtonDate = ({ onClick, selected, state, itemId, highlight }) => {
  const visibility = React.useContext(VisibilityContext);
  const visible = visibility.isItemVisible(itemId);

  return (
    <li className="flex justify-center items-center flex-col">
      <button
        className={`${
          selected ? 'text-white' : visible ? 'text-gray-400' : 'text-gray-600'
        } py-2 px-3`}
        onClick={() => onClick(visibility)}
      >
        {state.day}
      </button>

      {highlight.isPresent && (
        <div className="flex space-x-0.5">
          {highlight.sessions.map((item, key) => {
            return <span key={key} className={`${item.color} w-0.5 h-0.5 `} />;
          })}
        </div>
      )}
    </li>
  );
};

const handleHighlight = (state, group) => {
  const data =
    group &&
    group.workouts?.length &&
    group.workouts.map((item) => {
      return {
        month: new Date(item.workout_dt).getMonth() + 1,
        day: new Date(item.workout_dt).getDate(),
        year: new Date(item.workout_dt).getFullYear(),
        type: item.type,
      };
    });

  const matchedStates =
    data &&
    data?.filter((s) => {
      return (
        s.day === state.day && s.month === state.month && s.year === state.year
      );
    });

  if (matchedStates && !!matchedStates.length) {
    return {
      isPresent: true,
      sessions: matchedStates.map((state) => {
        return {
          isCompleted: true,
          color: getHighlightColor(state.type),
        };
      }),
    };
  }

  return {
    isPresent: false,
  };
};

const getHighlightColor = (type) => {
  switch (type) {
    case 'cardio':
      return 'bg-yellow-300';
    case 'strength':
      return 'bg-green-300';
    case 'therapy':
      return 'bg-pink-400';
    case 'deload':
      return 'bg-red-500';
    default:
      return 'bg-green-300';
  }
};
