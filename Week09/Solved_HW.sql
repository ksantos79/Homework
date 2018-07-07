use sakila;

#1a
select first_name,last_name from actor;

#1b
select upper(concat(first_name,' ',last_name)) 'Actor Name' from actor;

#2a
select actor_id,first_name,last_name from actor
where first_name = 'Joe';

#2b
select * from actor where last_name like '%gen%';

#2c
select * from actor where last_name like '%li%' order by last_name, first_name;

#2d
select country_id,country from country where country in ('Afghanistan', 'Bangladesh', 'China');

#3a
alter table actor add column middle_name varchar(45) after first_name;

#3b
alter table actor modify middle_name blob;

#3c
alter table actor drop column middle_name;

#4a
select last_name,count(*) 'Number of actors' from actor group by last_name order by last_name;

#4b
select last_name,count(*) 'Number of actors' from actor group by last_name having count(*) >1 order by last_name;

#4c
update actor set first_name = 'HARPO' where first_name = 'GROUCHO' and last_name = 'WILLIAMS';

#4d
update actor 
set first_name = case when first_name = 'HARPO' then 'GROUCHO'
					  else 'MUCHO GROUCHO' end 
where actor_id = 172;


#5a
show create table address;
#or
desc address;

#6a
select first_name,last_name,address from staff s 
join address a on a.address_id = s.address_id;

#6b
select concat(first_name,' ',last_name) 'Employee name',sum(p.amount) 'Total amount' from staff s 
join payment p on p.staff_id = s.staff_id
where year(p.payment_date) = 2005 and month(p.payment_date) = 8
group by p.staff_id;

#6c
select f.title,count(fa.actor_id) 'number of actors' from film f 
join film_actor fa on fa.film_id = f.film_id
group by fa.film_id;

#6d
select f.title, count(i.film_id) 'number of copies' from film f
join inventory i on i.film_id = f.film_id
where f.title = 'Hunchback Impossible';

#6e
select last_name,first_name,sum(p.amount) 'total amount' from payment p
join customer c on p.customer_id = c.customer_id
group by p.customer_id,last_name,first_name
order by last_name,first_name;

#7a
select title from film where title like 'k%' or title like 'q%'
order by title;

#7b
select * from actor where actor_id in (
	select actor_id from film_actor where film_id in (
		select film_id from film where title = 'Alone Trip')
    );

#7c
select first_name,last_name,email from customer where address_id in (
	select address_id from address where city_id in (
		select city_id from city where country_id in (
			select country_id from country where country = 'CANADA')
	)
);


#7d
select title from film where film_id in (
	select film_id from film_category where category_id in (
		select category_id from category where name = 'Family'
    )
);

#7e
select title , count(p.payment_id) 'number of rentals' from film f 
	join inventory i on i.film_id = f.film_id
    join rental r on r.inventory_id = i.inventory_id
    join payment p on p.rental_id = r.rental_id
group by title
order by count(p.payment_id) desc;


#7f
select s.store_id,sum(p.amount) 'store revenue' from store s
	join customer c on c.store_id = s.store_id
    join payment p on p.customer_id = c.customer_id
group by s.store_id
order by sum(p.amount) desc;

#7g
select s.store_id,c.city,cy.country from store s
	join address a on a.address_id = s.address_id
    join city c on c.city_id = a.city_id
    join country cy on cy.country_id = c.country_id;

#7h
select ct.name,sum(p.amount) 'gross revenue' from category ct
	join film_category fc on fc.category_id = ct.category_id
    join inventory i on i.film_id = fc.film_id
    join rental r on i.inventory_id = r.inventory_id
    join payment p on p.rental_id = r.rental_id
group by ct.name
order by sum(p.amount) desc
limit 5;

#8a
create view top_five_genres as 
select ct.name,sum(p.amount) 'gross revenue' from category ct
	join film_category fc on fc.category_id = ct.category_id
    join inventory i on i.film_id = fc.film_id
    join rental r on i.inventory_id = r.inventory_id
    join payment p on p.rental_id = r.rental_id
group by ct.name
order by sum(p.amount) desc
limit 5;

#8b
select * from top_five_genres;

#8c
drop view top_five_genres;