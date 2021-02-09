drop table if exists tb_herois;

create table tb_herois(
    id int generated always as IDENTITY primary key not null,
    nome text not null,
    poder text not null
);

--create
insert into tb_herois (nome,poder) values
    ('Flash', 'Velocidade'),
    ('Aquaman', 'Falar com os animais'),
    ('Batman', 'Dinheiro');

--read
select * from tb_herois;
select * from tb_herois where nome = 'Flash';

--update
update tb_herois set nome = 'Goku', poder  = 'Deus' where id = 1;

--delete
delete from tb_herois where id = 2;