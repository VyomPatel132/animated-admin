import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Package, Plus } from "lucide-react";
import { FadeUp, PageTransition } from "../components/core/Animation";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { EmptyState } from "../components/ui/empty-state";
import { LoadingButton } from "../components/ui/loading-button";
import { Modal } from "../components/ui/modal";
import { SearchInput } from "../components/ui/search-input";
import { Select } from "../components/ui/select";
import ProductArt from "../components/custom/ProductArt";
import { products as initialProducts } from "../data/mock";
import { currency } from "../utils/format";
import { useAppDispatch } from "../hooks/useStore";
import { notify } from "../store/slices/uiSlice";
const schema = z.object({
  name: z.string().min(2, "Enter a product name."),
  category: z.string().min(2, "Enter a category."),
  price: z.number().positive("Price must be greater than zero."),
  stock: z.number().int().nonnegative("Stock cannot be negative."),
});
type Values = z.infer<typeof schema>;
export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All products");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });
  function edit(p?: (typeof initialProducts)[number]) {
    setEditing(p?.name || null);
    reset(p || { name: "", category: "", price: 0, stock: 0 });
    setOpen(true);
  }
  async function save(values: Values) {
    await new Promise((r) => setTimeout(r, 350));
    setProducts((existing) =>
      editing
        ? existing.map((p) => (p.name === editing ? { ...p, ...values } : p))
        : [
            ...existing,
            { ...values, sold: 0, shape: "speaker", color: "#b3a0d0" },
          ],
    );
    setOpen(false);
    dispatch(
      notify(editing ? "Product updated." : "Product added to your catalog."),
    );
  }
  const filtered = products.filter(
    (p) =>
      `${p.name} ${p.category}`.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All products" ||
        (filter === "Low stock" ? p.stock < 20 : p.stock >= 20)),
  );
  return (
    <PageTransition>
      <div className="page-heading">
        <div>
          <div className="eyebrow">MADE TO STAND OUT</div>
          <h1>Your product collection</h1>
          <p>Thoughtfully curated. Beautifully managed.</p>
        </div>
        <Button variant="primary" onClick={() => edit()}>
          <Plus size={16} />
          Add product
        </Button>
      </div>
      <div className="collection-toolbar">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search your collection..."
        />
        <Select
          label="Inventory filter"
          value={filter}
          onChange={setFilter}
          options={["All products", "In stock", "Low stock"]}
        />
      </div>
      <div className="product-grid">
        {filtered.map((p, i) => (
          <FadeUp key={p.name} delay={i * 0.05}>
            <Card className="product-card">
              <div className="product-image">
                <ProductArt shape={p.shape} color={p.color} large />
                <Badge>{p.stock < 20 ? "Low stock" : "In stock"}</Badge>
              </div>
              <div className="product-card-body">
                <span className="small-label">{p.category}</span>
                <h2>{p.name}</h2>
                <div className="product-price">
                  <strong>{currency(p.price)}</strong>
                  <span>
                    <Package size={13} />
                    {p.stock} in stock
                  </span>
                </div>
                <div className="product-card-footer">
                  <span>{p.sold} sold this month</span>
                  <button onClick={() => edit(p)}>
                    Edit product <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </Card>
          </FadeUp>
        ))}
      </div>
      {!filtered.length && <EmptyState title="No products found" />}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit product" : "Add a product"}
      >
        <form className="form-stack" onSubmit={handleSubmit(save)}>
          <label>
            Product name
            <input
              {...register("name")}
              placeholder="Give your product a name"
            />
            {errors.name && (
              <span className="form-error">{errors.name.message}</span>
            )}
          </label>
          <label>
            Category
            <input
              {...register("category")}
              placeholder="e.g. Workspace essentials"
            />
            {errors.category && (
              <span className="form-error">{errors.category.message}</span>
            )}
          </label>
          <div className="form-grid">
            <label>
              Price ($)
              <input
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
              />
              {errors.price && (
                <span className="form-error">{errors.price.message}</span>
              )}
            </label>
            <label>
              Stock
              <input
                type="number"
                {...register("stock", { valueAsNumber: true })}
              />
              {errors.stock && (
                <span className="form-error">{errors.stock.message}</span>
              )}
            </label>
          </div>
          <div className="modal-actions">
            <Button type="button" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <LoadingButton loading={isSubmitting}>Save product</LoadingButton>
          </div>
        </form>
      </Modal>
    </PageTransition>
  );
}
