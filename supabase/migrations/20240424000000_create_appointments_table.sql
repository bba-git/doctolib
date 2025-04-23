-- Create appointments table
CREATE TABLE appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('visio', 'in_person')),
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_appointments_professional_id ON appointments(professional_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Professionals can view their own appointments
CREATE POLICY "Professionals can view their own appointments"
    ON appointments FOR SELECT
    USING (auth.uid() = professional_id);

-- Patients can view their own appointments
CREATE POLICY "Patients can view their own appointments"
    ON appointments FOR SELECT
    USING (auth.uid() = patient_id);

-- Professionals can create appointments
CREATE POLICY "Professionals can create appointments"
    ON appointments FOR INSERT
    WITH CHECK (auth.uid() = professional_id);

-- Patients can create appointments
CREATE POLICY "Patients can create appointments"
    ON appointments FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

-- Professionals can update their own appointments
CREATE POLICY "Professionals can update their own appointments"
    ON appointments FOR UPDATE
    USING (auth.uid() = professional_id);

-- Patients can update their own appointments
CREATE POLICY "Patients can update their own appointments"
    ON appointments FOR UPDATE
    USING (auth.uid() = patient_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 