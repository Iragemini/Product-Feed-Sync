-- Create schema
CREATE SCHEMA IF NOT EXISTS feed;

-- Create products table
CREATE TABLE IF NOT EXISTS feed.products(
  id text PRIMARY KEY,
  title text NOT NULL,
  link text NOT NULL,
  image_link text,
  price numeric(10, 2) NOT NULL,
  currency text NOT NULL,
  availability text NOT NULL
);

CREATE OR REPLACE FUNCTION feed.create_or_update_product(p_id text, p_title text, p_link text, p_image_link text, p_price numeric, p_currency text, p_availability text)
  RETURNS VOID
  LANGUAGE plpgsql
  AS $$
BEGIN
  INSERT INTO feed.products(id, title, link, image_link, price, currency, availability)
    VALUES(p_id, p_title, p_link, p_image_link, p_price, p_currency, p_availability)
  ON CONFLICT(id)
    DO UPDATE SET
      title = EXCLUDED.title,
      link = EXCLUDED.link,
      image_link = EXCLUDED.image_link,
      price = EXCLUDED.price,
      currency = EXCLUDED.currency,
      availability = EXCLUDED.availability;
END;
$$;

CREATE OR REPLACE FUNCTION feed.remove_product_by_id(p_id text)
  RETURNS boolean
  LANGUAGE plpgsql
  AS $$
DECLARE
  deleted_count int;
BEGIN
  DELETE FROM feed.products
  WHERE id = p_id;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count > 0;
END;
$$;

CREATE OR REPLACE FUNCTION feed.remove_products_by_ids(p_ids TEXT[])
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM feed.products
    WHERE id = ANY(p_ids);
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

CREATE OR REPLACE FUNCTION feed.search_products_by_title(p_title text)
  RETURNS TABLE(
    id text,
    title text,
    link text,
    image_link text,
    price numeric,
    currency text,
    availability text)
  LANGUAGE sql
  AS $$
  SELECT
    *
  FROM
    feed.products
  WHERE
    title ILIKE '%' || p_title || '%';
$$;

