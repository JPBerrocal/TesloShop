"use client";

import { useState } from "react";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
  quantity: number;
  onQuantityChange: (value: number) => void;
}

const MINIMUN_QUANTITY = 1;
const MAXIMUN_QUANTITY = 5;

export const QuantitySelector = ({ quantity, onQuantityChange }: Props) => {
  const handleQuantityChange = (value: number) => {
    const newValue = quantity + value;
    if (newValue < MINIMUN_QUANTITY) return;
    if (newValue > MAXIMUN_QUANTITY) return;

    onQuantityChange(newValue);
  };

  return (
    <div className="flex">
      <button onClick={() => handleQuantityChange(-1)}>
        <IoRemoveCircleOutline size={30} />
      </button>
      <span className="w-20 mx-3 px-5 bg-gray-300 text-center rounded">
        {quantity}
      </span>
      <button onClick={() => handleQuantityChange(1)}>
        <IoAddCircleOutline size={30} />
      </button>
    </div>
  );
};
