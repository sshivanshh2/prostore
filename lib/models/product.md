# Product

Represents a sellable product.

Core fields:
- id
- name
- description
- basePrice
- category
- isActive

Relationships:
- has many Variants
- has many Reviews

Notes:
- Variants handle size, color, etc.
- Pricing adjustments may exist per variant
