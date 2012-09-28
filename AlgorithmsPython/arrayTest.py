from random import randrange;
i = 5;
a = [randrange(2*1024) for i in range(4*1024)]

s = ""
for n in a:
	s += str(n) + " "

print(s);

