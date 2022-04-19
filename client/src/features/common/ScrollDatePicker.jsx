import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollMenu,
  VisibilityContext,
  getItemsPos,
} from 'react-horizontal-scrolling-menu';
import useDrag from './useDrag';
import { v4 as uuidv4 } from 'uuid';

export const ScrollDatePicker = () => {
  const [selectedDate] = useState(new Date());
  const [items] = useState(generateCalendarState(selectedDate));
  const [selected, setSelected] = useState([]);
  const { dragStart, dragStop, dragMove, dragging } = useDrag();

  const [hasMounted, setHasMounted] = useState(false);

  const apiRef = useRef();

  const reset = () => {
    const currentId = items.filter(
      (item) =>
        item.day === selectedDate.getDate() &&
        item.month === selectedDate.getMonth() + 1
    )[0].id;

    apiRef.current.scrollToItem(
      apiRef.current.getItemElementById(currentId),
      'smooth',
      'center'
    );
  };

  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
      setSelected(
        items.filter(
          (item) =>
            item.day === selectedDate.getDate() &&
            item.month === selectedDate.getMonth() + 1
        )[0].id
      );
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
      setSelected(itemId);
      scrollToItem(getItemById(itemId), 'smooth', 'center', 'nearest');
    };

  return (
    <div className="pt-5">
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
                day={state.day}
                onClick={handleItemClick(state.id)}
                itemId={state.id}
                key={key}
                selected={state.id === selected}
              />
            );
          })}
        </ScrollMenu>
      </ul>
    </div>
  );
};

const ButtonDate = ({ onClick, selected, day, itemId }) => {
  const visibility = React.useContext(VisibilityContext);
  const visible = visibility.isItemVisible(itemId);

  return (
    <li>
      <button
        className={`${
          selected ? 'text-white' : visible ? 'text-gray-400' : 'text-gray-600'
        } py-2 px-3`}
        onClick={() => onClick(visibility)}
      >
        {day}
      </button>
    </li>
  );
};

const generateCalendarState = (selectedDate) => {
  const currentMonthState = [
    ...Array(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0
      ).getDate()
    ),
  ].map((_, key) => {
    return {
      day: key + 1,
      month: selectedDate.getMonth() + 1,
      year: selectedDate.getFullYear(),
      id: uuidv4(),
    };
  });

  const nextMonthInDaysState = [
    ...Array(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 2,
        0
      ).getDate()
    ).keys(),
  ].map((_, key) => {
    return {
      day: key + 1,
      month: selectedDate.getMonth() + 2,
      year: selectedDate.getFullYear(),
      id: uuidv4(),
    };
  });

  const previousMonthInDaysState = [
    ...Array(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0).getDate()
    ).keys(),
  ].map((_, key) => {
    return {
      day: key + 1,
      month: selectedDate.getMonth(),
      year: selectedDate.getFullYear(),
      id: uuidv4(),
    };
  });

  return [
    ...previousMonthInDaysState,
    ...currentMonthState,
    ...nextMonthInDaysState,
  ];
};
