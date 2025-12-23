import mongoose from 'mongoose';

const PizzaSizeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    diameter: { type: String },
    price_multiplier: { type: Number, default: 1 }
  },
  { _id: false }
);

const PizzaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    image: { type: String },
    base_price: { type: Number, required: true },
    category: { type: String, required: true, index: true },
    ingredients: { type: [String], default: [] },
    available: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    review_count: { type: Number, default: 0 },
    pizza_sizes: { type: [PizzaSizeSchema], default: [] }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export default mongoose.models.Pizza || mongoose.model('Pizza', PizzaSchema);
