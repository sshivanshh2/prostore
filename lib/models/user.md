# User

Represents a registered customer or admin.

Core fields:
- id
- email
- name
- role (customer | admin)

Relationships:
- has many Orders
- has one Cart
- can write Reviews

Notes:
- Authentication details are handled separately
- Role-based access is enforced at the application layer
