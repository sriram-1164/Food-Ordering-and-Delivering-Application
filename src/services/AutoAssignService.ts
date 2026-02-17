import { CrudService } from "./CrudService";
import { UserDetails } from "./Model";

const crud = CrudService();

export const autoAssignOrder = async (orderId: string) => {
  try {
    // 1️⃣ Get all users
    const users = await crud.getUsers();

    // 2️⃣ Filter available delivery persons
    const availableDelivery = users.find(
      (user: UserDetails) =>
        user.role === "delivery" &&
        user.isOnline === true &&
        user.isBusy === false
    );

    if (!availableDelivery) {
      console.log("❌ No delivery partner available");
      return;
    }

    // 3️⃣ Assign order
    await crud.updateOrder(orderId, {
      status: "OutforDelivery",
      deliveryPartnerId: availableDelivery.id,
    });

    // 4️⃣ Mark delivery partner busy
    await crud.updateUser(availableDelivery.id, {
      isBusy: true,
    });

    console.log("✅ Order assigned to:", availableDelivery.username);
  } catch (error) {
    console.error("Auto Assign Error:", error);
  }
};
