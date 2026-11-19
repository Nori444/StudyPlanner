import matplotlib; matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Rectangle
plt.rcParams['font.family']='DejaVu Sans'
fig, ax = plt.subplots(figsize=(9,9.4)); ax.set_xlim(0,120); ax.set_ylim(108,0); ax.axis('off')
P = {'Студент':10,'UI (index.html)':34,'Task Service':58,'Storage Adapter':82,'localStorage':106}
for n,x in P.items():
    ax.add_patch(FancyBboxPatch((x-9.5,1),19,5,boxstyle='round,pad=0.2,rounding_size=1',fc='#dfe4ff' if n!='Студент' else '#fff4d6',ec='#5265c9'))
    ax.text(x,3.5,n,ha='center',va='center',fontsize=8.8,weight='bold')
    ax.plot([x,x],[7,106],color='#9aa3c7',lw=1,ls=(0,(4,3)))
def msg(a,b,y,t,dash=False,color='#2b3350'):
    xa,xb=P[a],P[b]
    ax.annotate('',xy=(xb,y),xytext=(xa,y),arrowprops=dict(arrowstyle='->',color=color,lw=1.3,ls='--' if dash else '-'))
    ax.text((xa+xb)/2,y-0.9,t,ha='center',va='bottom',fontsize=8.6,color=color,bbox=dict(fc='white',ec='none',pad=0.6),zorder=5)
def selfmsg(a,y,t):
    x=P[a]; ax.plot([x,x+6,x+6,x+0.3],[y,y,y+2.6,y+2.6],color='#2b3350',lw=1.3)
    ax.annotate('',xy=(x,y+2.6),xytext=(x+1,y+2.6),arrowprops=dict(arrowstyle='->',color='#2b3350',lw=1.3))
    ax.text(x+7,y+1.3,t,va='center',fontsize=8.6)
def frame(y1,y2,x1,x2,label,color):
    ax.add_patch(Rectangle((x1,y1),x2-x1,y2-y1,fill=False,ec=color,lw=1.2))
    ax.add_patch(Rectangle((x1,y1),16,2.8,fc=color,ec=color)); ax.text(x1+8,y1+1.4,label,color='white',ha='center',va='center',fontsize=8,weight='bold')
msg('Студент','UI (index.html)',10,'вводить дані; «Додати»')
msg('UI (index.html)','Task Service',16,'addTask({title, subject, due})')
selfmsg('Task Service',20,'trim(title); 1 ≤ len ≤ 100')
frame(26,104,2,118,'alt','#5265c9')
ax.text(20,29.6,'[назва порожня або > 100 символів]',fontsize=8.6,style='italic',color='#b3261e')
msg('Task Service','UI (index.html)',34,'error VALIDATION_TITLE',dash=True,color='#b3261e')
msg('UI (index.html)','Студент',40,'підсвічує поле + текст помилки',dash=True,color='#b3261e')
ax.plot([3,116],[44,44],color='#5265c9',lw=1,ls=(0,(5,3)))
ax.text(20,46.6,'[назва коректна]',fontsize=8.6,style='italic',color='#17623a')
selfmsg('Task Service',49,'новий Task {UUID, todo}')
msg('Task Service','Storage Adapter',57,'save(tasks)')
msg('Storage Adapter','localStorage',62,'setItem(tasks.v1, JSON)')
frame(65,94,5,114,'alt','#c79a1e')
ax.text(27,68.6,'[QuotaExceededError / сховище недоступне]',fontsize=8.6,style='italic',color='#b3261e')
msg('localStorage','Storage Adapter',73,'exception',dash=True,color='#b3261e')
msg('Storage Adapter','Task Service',77,'error STORAGE_WRITE',dash=True,color='#b3261e')
msg('Task Service','UI (index.html)',81,'error (стан відкочено)',dash=True,color='#b3261e')
msg('UI (index.html)','Студент',85,'банер «Не вдалося зберегти»',dash=True,color='#b3261e')
ax.plot([5,114],[87.2,87.2],color='#c79a1e',lw=1,ls=(0,(5,3)))
ax.text(27,89.7,'[запис успішний]',fontsize=8.6,style='italic',color='#17623a')
msg('localStorage','Storage Adapter',92,'ok',dash=True,color='#17623a')
msg('Task Service','UI (index.html)',98,'Task',dash=True,color='#17623a')
msg('UI (index.html)','Студент',102,'список оновлено + повідомлення про успіх',dash=True,color='#17623a')
plt.tight_layout(); plt.savefig('img/05_sequence.png',dpi=170,bbox_inches='tight',facecolor='white')
