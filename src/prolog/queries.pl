:- consult('car_knowledge_base.pl').

% 1. List all vehicle information with selling price less than 100,000
under_budget(Name, Price) :-
    car(Name, _, Price, _, _),
    Price < 100000.

% 2. List all vehicle information with selling price greater than 100,000
over_budget(Name, Price) :-
    car(Name, _, Price, _, _),
    Price > 100000.

% 3. Find the vehicle with preferred transmission type
check_transmission(Type, Name) :-
    car(Name, _, _, _, Type).