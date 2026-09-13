import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import { LoadingButton } from "../ui/loading-button";
import { Modal } from "../ui/modal";
import { products } from "../../data/mock";
import { useAppDispatch } from "../../hooks/useStore";
import { addOrder } from "../../store/slices/dashboardSlice";
import { notify } from "../../store/slices/uiSlice";
const schema = z.object({
  name: z.string().min(2, "Please enter the customer’s full name."),
  email: z.email("Enter a valid email address."),
  product: z.string().min(1, "Select a product."),
  quantity: z.number().min(1).max(100),
});
type Values = z.infer<typeof schema>;
export default function OrderModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: 1, product: products[0].name },
  });
  async function submit(values: Values) {
    await new Promise((r) => setTimeout(r, 450));
    dispatch(
      addOrder({
        id: `AP-${Date.now().toString().slice(-6)}`,
        name: values.name,
        email: values.email,
        amount:
          (products.find((p) => p.name === values.product)?.price || 0) *
          values.quantity,
        product: values.product,
        date: new Date().toISOString().slice(0, 10),
        status: "Pending",
        avatar: values.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      }),
    );
    dispatch(notify("Order created. You’re all set."));
    reset();
    onClose();
  }
  return (
    <Modal open={open} onClose={onClose} title="Create a new order">
      <p className="muted modal-intro">
        A great experience starts with the details.
      </p>
      <form onSubmit={handleSubmit(submit)} className="form-stack">
        <label>
          Customer name
          <input
            {...register("name")}
            placeholder="e.g. Olivia Rhye"
            autoComplete="name"
          />
          {errors.name && (
            <span className="form-error">{errors.name.message}</span>
          )}
        </label>
        <label>
          Email address
          <input
            {...register("email")}
            placeholder="olivia@company.com"
            autoComplete="email"
          />
          {errors.email && (
            <span className="form-error">{errors.email.message}</span>
          )}
        </label>
        <div className="form-grid">
          <label>
            Product
            <select {...register("product")}>
              {products.map((p) => (
                <option key={p.name}>{p.name}</option>
              ))}
            </select>
          </label>
          <label>
            Quantity
            <input
              type="number"
              min="1"
              max="100"
              {...register("quantity", { valueAsNumber: true })}
            />
          </label>
        </div>
        <AnimatePresence>
          {errors.quantity && (
            <motion.p
              className="form-error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Choose a quantity between 1 and 100.
            </motion.p>
          )}
        </AnimatePresence>
        <div className="modal-actions">
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" loading={isSubmitting}>
            Create order
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}
