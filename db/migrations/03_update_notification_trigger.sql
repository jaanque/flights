CREATE OR REPLACE FUNCTION create_flight_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Notification for flight approval
  IF NEW.status = true AND OLD.status = false THEN
    INSERT INTO public.notifications (user_id, message)
    VALUES (NEW.user_id, 'Tu vuelo ' || NEW.flight_number || ' ha sido aprobado. Se han añadido ' || NEW.delay_minutes || ' minutos a tu cuenta.');
  -- Notification for flight modification (delay_minutes changed)
  ELSIF NEW.status = true AND OLD.status = true AND NEW.delay_minutes <> OLD.delay_minutes THEN
    INSERT INTO public.notifications (user_id, message)
    VALUES (NEW.user_id, 'El vuelo ' || NEW.flight_number || ' ha sido modificado. Se han actualizado los minutos a ' || NEW.delay_minutes || '.');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;