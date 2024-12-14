"use server";

import { Address } from "@/interfaces";
import prisma from "@/lib/prisma";

export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const newAddress = await createOrReplaceAddress(address, userId);

    return {
      ok: true,
      address: newAddress,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error al registrar la dirección",
    };
  }
};

const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    const storedAddress = await prisma.userAddress.findFirst({
      where: {
        userId: userId,
      },
    });

    const addressToSave = {
      address: address.address,
      address2: address.address2,
      city: address.city,
      firstName: address.firstName,
      lastName: address.lastName,
      postalCode: address.postalCode,
      phone: address.phone,
    };

    if (!storedAddress) {
      const newAddress = await prisma.userAddress.create({
        data: {
          ...addressToSave,
          country: {
            connect: {
              id: address.country,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return newAddress;
    }

    const updatedAddress = await prisma.userAddress.update({
      where: {
        id: storedAddress.id,
      },
      data: {
        ...addressToSave,
        country: {
          connect: {
            id: address.country,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return updatedAddress;
  } catch (error) {
    console.log(error);
    throw new Error("Error al registrar la dirección");
  }
};

export const deleteUserAddress = async (userId: string) => {
  try {
    const storedAddress = await prisma.userAddress.findFirst({
      where: {
        userId: userId,
      },
    });

    if (storedAddress) {
      await prisma.userAddress.delete({
        where: {
          id: storedAddress.id,
        },
      });
    }

    return {
      ok: true,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Error al eliminar la dirección",
    };
  }
};

export const getUserAddress = async (userId: string) => {
  try {
    const address = await prisma.userAddress.findUnique({
      where: {
        userId: userId,
      },
    });

    if (!address) return null;

    const { countryId, address2, ...rest } = address;

    return {
      ...rest,
      country: countryId,
      address2: address2 || "",
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
