-- Migration: Add foreign keys, indexes, and fix data types
-- Description: Improves database integrity with foreign key constraints, performance with indexes,
--              and data consistency by changing contract_templates.active from text to boolean

-- Step 1: Change contract_templates.active from text to boolean
-- First, update existing data to ensure consistency
UPDATE contract_templates
SET active = 'true'
WHERE active NOT IN ('true', 'false');

-- Add a temporary boolean column
ALTER TABLE contract_templates ADD COLUMN active_bool boolean NOT NULL DEFAULT true;

-- Copy data from text column to boolean column
UPDATE contract_templates
SET active_bool = CASE WHEN active = 'true' THEN true ELSE false END;

-- Drop the old text column
ALTER TABLE contract_templates DROP COLUMN active;

-- Rename the new column to match the original name
ALTER TABLE contract_templates RENAME COLUMN active_bool TO active;

-- Step 2: Add foreign key constraints
ALTER TABLE contracts
ADD CONSTRAINT contracts_template_id_fkey
FOREIGN KEY (template_id)
REFERENCES contract_templates(id);

ALTER TABLE contracts
ADD CONSTRAINT contracts_contact_inquiry_id_fkey
FOREIGN KEY (contact_inquiry_id)
REFERENCES contact_inquiries(id);

-- Step 3: Add indexes for frequently queried fields
CREATE INDEX IF NOT EXISTS contract_templates_contract_type_idx ON contract_templates(contract_type);
CREATE INDEX IF NOT EXISTS contract_templates_active_idx ON contract_templates(active);
CREATE INDEX IF NOT EXISTS contracts_client_email_idx ON contracts(client_email);
CREATE INDEX IF NOT EXISTS contracts_status_idx ON contracts(status);
CREATE INDEX IF NOT EXISTS contracts_template_id_idx ON contracts(template_id);
CREATE INDEX IF NOT EXISTS contracts_contact_inquiry_id_idx ON contracts(contact_inquiry_id);

-- Step 4: Add comments for documentation
COMMENT ON COLUMN contract_templates.active IS 'Whether this contract template is active and available for use';
COMMENT ON COLUMN contracts.template_id IS 'Foreign key reference to contract_templates table';
COMMENT ON COLUMN contracts.contact_inquiry_id IS 'Foreign key reference to contact_inquiries table';
