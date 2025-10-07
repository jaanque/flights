CREATE OR REPLACE FUNCTION create_flight_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = true AND OLD.status = false THEN
    INSERT INTO public.notifications (user_id, message)
    VALUES (NEW.user_id, 'Tu vuelo ' || NEW.flight_number || ' ha sido aprobado. Se han añadido ' || NEW.delay_minutes || ' minutos a tu cuenta.');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_flight_approved_trigger
AFTER UPDATE ON public.flights
FOR EACH ROW
EXECUTE FUNCTION create_flight_notification();